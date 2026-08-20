// app/track/[token]/page.jsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

const STATUS_LABEL = {
  pending: 'Finding driver...', dispatched: 'Finding driver...',
  accepted: 'Driver assigned', on_the_way: 'Driver is on the way',
  arrived: 'Driver has arrived', active: 'Ride in progress',
  paused: 'Driver is waiting', completed: 'Ride completed', cancelled: 'Ride cancelled',
}

// Trip progress stepper — order matters
const STEPS = [
  { key: 'accepted',  label: 'Assigned'  },
  { key: 'on_the_way',label: 'On the way'},
  { key: 'arrived',   label: 'Arrived'   },
  { key: 'active',    label: 'In progress'},
  { key: 'completed', label: 'Completed' },
]
function stepIndex(status) {
  if (status === 'pending' || status === 'dispatched') return -1
  if (status === 'paused') return STEPS.findIndex(s => s.key === 'active') // treat paused as active-stage
  if (status === 'cancelled') return -1
  return STEPS.findIndex(s => s.key === status)
}

export default function TrackingPage() {
  const { token } = useParams()
  const supabase = createClient()

  const [booking, setBooking] = useState(null)
  const [driverLoc, setDriverLoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [expired, setExpired] = useState(false)

  // Live ETA
  const [etaMin, setEtaMin] = useState(null)          // driver -> pickup OR driver -> dropoff (contextual)
  const [dropoffEtaTime, setDropoffEtaTime] = useState(null) // clock time estimate for dropoff arrival

  const mapRef        = useRef(null)
  const mapInstance    = useRef(null)
  const driverMarker   = useRef(null)
  const scriptLoaded   = useRef(false)

  // ── Fetch booking ─────────────────────────────────────
  useEffect(() => {
    if (!token) { setError(true); setLoading(false); return }
    supabase.from('public_ride_tracking').select('*').eq('share_token', token).maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) { setError(true); setLoading(false); return }
        if (data.share_token_expires_at && new Date(data.share_token_expires_at) < new Date()) {
          setExpired(true); setLoading(false); return
        }
        setBooking(data)
        setLoading(false)
      })
  }, [token])

  // ── Realtime booking status ────────────────────────────
  useEffect(() => {
    if (!booking?.id) return
    const ch = supabase.channel(`track-${booking.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `id=eq.${booking.id}` },
        ({ new: updated }) => setBooking(prev => ({ ...prev, ...updated })))
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [booking?.id])

  // ── Realtime driver location ───────────────────────────
  useEffect(() => {
    if (!booking?.driver_id || !['on_the_way','arrived','active','paused'].includes(booking?.status)) return
    const ch = supabase.channel(`driver-loc-${booking.driver_id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'driver_locations', filter: `driver_id=eq.${booking.driver_id}` },
        ({ new: loc }) => setDriverLoc({ lat: Number(loc.lat), lng: Number(loc.lng) }))
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [booking?.driver_id, booking?.status])

  // ── Live ETA — recompute every 20s while relevant ──────
  useEffect(() => {
    if (!booking || !window.google) return
    if (!['on_the_way', 'active', 'paused'].includes(booking.status)) { setEtaMin(null); return }

    const dest = booking.status === 'on_the_way'
      ? { lat: booking.pickup_lat, lng: booking.pickup_lng }
      : { lat: booking.dropoff_lat, lng: booking.dropoff_lng }

    if (!driverLoc || !dest.lat) return

    const fetchEta = () => {
      const service = new window.google.maps.DirectionsService()
      service.route({
        origin: driverLoc,
        destination: { lat: Number(dest.lat), lng: Number(dest.lng) },
        travelMode: window.google.maps.TravelMode.DRIVING,
        drivingOptions: { departureTime: new Date(), trafficModel: 'bestguess' },
      }, (result, status) => {
        if (status === 'OK' && result.routes?.[0]?.legs?.[0]) {
          const leg = result.routes[0].legs[0]
          const min = Math.ceil((leg.duration_in_traffic || leg.duration).value / 60)
          setEtaMin(min)
          if (booking.status !== 'on_the_way') {
            const arrival = new Date(Date.now() + min * 60000)
            setDropoffEtaTime(arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
          }
        }
      })
    }

    fetchEta()
    const interval = setInterval(fetchEta, 20000) // har 20 sec update
    return () => clearInterval(interval)
  }, [driverLoc, booking?.status, booking?.pickup_lat, booking?.dropoff_lat])

  // ── Load Google Maps script ────────────────────────────
  useEffect(() => {
    if (scriptLoaded.current || !booking?.pickup_lat) return
    scriptLoaded.current = true
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`
    script.async = true
    script.onload = initMap
    document.head.appendChild(script)
  }, [booking?.pickup_lat])

  const initMap = () => {
    if (!window.google || !mapRef.current) return
    const center = { lat: Number(booking.pickup_lat), lng: Number(booking.pickup_lng) }
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center, zoom: 14, disableDefaultUI: true, zoomControl: true,
      styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }],
    })

    new window.google.maps.Marker({
      position: center, map: mapInstance.current,
      icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 7, fillColor: '#22C55E', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 3 },
    })

    if (booking.dropoff_lat) {
      new window.google.maps.Marker({
        position: { lat: Number(booking.dropoff_lat), lng: Number(booking.dropoff_lng) }, map: mapInstance.current,
        icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 6, fillColor: '#111', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 3 },
      })
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend(center)
      bounds.extend({ lat: Number(booking.dropoff_lat), lng: Number(booking.dropoff_lng) })
      mapInstance.current.fitBounds(bounds, 60)
    }
  }

  useEffect(() => {
    if (!driverLoc || !mapInstance.current || !window.google) return
    if (!driverMarker.current) {
      driverMarker.current = new window.google.maps.Marker({
        position: driverLoc, map: mapInstance.current,
        icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: '#000', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 3 },
      })
    } else {
      driverMarker.current.setPosition(driverLoc)
    }
    mapInstance.current.panTo(driverLoc)
  }, [driverLoc])

  // ── Deep-link — try opening app, fallback stays on web ─
  const openInApp = () => {
    const deepLink = `blackdrivo://track/${token}`
    window.location.href = deepLink
    // Agar app installed nahi, kuch nahi hota — user web page pe hi rahega
  }

  if (loading) {
    return <div style={styles.centerScreen}><div style={styles.spinner} /></div>
  }

  if (expired) {
    return (
      <div style={styles.centerScreen}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Link expired</div>
          <div style={{ fontSize: 14, color: '#6B7280' }}>This tracking link is no longer active.</div>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div style={styles.centerScreen}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Link not found</div>
          <div style={{ fontSize: 14, color: '#6B7280' }}>This tracking link may have expired.</div>
        </div>
      </div>
    )
  }

  const isEnded = ['completed', 'cancelled'].includes(booking.status)
  const curStepIdx = stepIndex(booking.status)

  return (
    <div style={styles.page}>
      {/* Deep-link banner */}
      <div style={styles.appBanner} onClick={openInApp}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Open in BlackDrivo app</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Live tracking, faster</span>
      </div>

      <div ref={mapRef} style={styles.map} />

      <div style={styles.sheet}>
        <div style={styles.handle} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: isEnded ? '#9CA3AF' : '#22C55E' }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{STATUS_LABEL[booking.status] || booking.status}</span>
        </div>
        <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>{booking.booking_ref}</div>

        {/* Live ETA countdown */}
        {etaMin !== null && !isEnded && (
          <div style={{ marginBottom: 18 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: '#111' }}>{etaMin} min</span>
            <span style={{ fontSize: 13, color: '#9CA3AF', marginLeft: 6 }}>
              {booking.status === 'on_the_way' ? 'until pickup' : 'until arrival'}
            </span>
            {dropoffEtaTime && booking.status !== 'on_the_way' && (
              <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Estimated arrival at {dropoffEtaTime}</div>
            )}
          </div>
        )}

        {/* Trip progress stepper */}
        {!isEnded && curStepIdx >= 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {STEPS.slice(0, 4).map((step, i) => (
                <div key={step.key} style={{ flex: i < 3 ? 1 : 0, display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: i === curStepIdx ? 10 : 8, height: i === curStepIdx ? 10 : 8, borderRadius: '50%',
                    background: i <= curStepIdx ? '#111' : '#E5E7EB', flexShrink: 0,
                  }} />
                  {i < 3 && (
                    <div style={{ flex: 1, height: 2, background: i < curStepIdx ? '#111' : '#E5E7EB', marginLeft: 4, marginRight: 4 }} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              {STEPS.slice(0, 4).map((step, i) => (
                <span key={step.key} style={{
                  fontSize: 10, fontWeight: i === curStepIdx ? 700 : 500,
                  color: i <= curStepIdx ? '#111' : '#9CA3AF',
                  flex: i === 0 ? '0 0 auto' : i === 3 ? '0 0 auto' : 1, textAlign: i === 0 ? 'left' : i === 3 ? 'right' : 'center',
                }}>
                  {step.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Route */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 9, height: 9, borderRadius: 4.5, background: '#22C55E', marginTop: 4, flexShrink: 0 }} />
            <div style={{ fontSize: 13, color: '#111', fontWeight: 500 }}>{booking.pickup_address || '—'}</div>
          </div>
          {booking.dropoff_address && (
            <>
              <div style={{ width: 1, height: 14, background: '#E5E7EB', marginLeft: 4, marginBottom: 8 }} />
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 9, height: 9, borderRadius: 2, background: '#111', marginTop: 4, flexShrink: 0 }} />
                <div style={{ fontSize: 13, color: '#111', fontWeight: 500 }}>{booking.dropoff_address}</div>
              </div>
            </>
          )}
        </div>

        {/* Driver + vehicle */}
        {booking.driver_name && !isEnded && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
            {booking.driver_photo_url
              ? <img src={booking.driver_photo_url} alt="" style={{ width: 48, height: 48, borderRadius: 24, objectFit: 'cover' }} />
              : <div style={{ width: 48, height: 48, borderRadius: 24, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#111' }}>
                  {(booking.driver_name || 'D')[0].toUpperCase()}
                </div>
            }
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{booking.driver_name}</div>
              {booking.make && (
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                  {booking.color} {booking.make} {booking.model} · {booking.registration}
                </div>
              )}
            </div>
            {booking.driver_rating && (
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>★ {Number(booking.driver_rating).toFixed(1)}</div>
            )}
          </div>
        )}

        {isEnded && (
          <div style={{ paddingTop: 16, borderTop: '1px solid #F3F4F6', textAlign: 'center', fontSize: 13, color: '#9CA3AF' }}>
            This ride has {booking.status === 'completed' ? 'been completed' : 'been cancelled'}.
          </div>
        )}

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#111', letterSpacing: 0.5 }}>BLACKDRIVO</span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page:   { position: 'relative', width: '100vw', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflow: 'hidden' },
  map:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheet:  { position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '20px 24px 32px', boxShadow: '0 -4px 24px rgba(0,0,0,0.08)', maxWidth: 480, margin: '0 auto', maxHeight: '70vh', overflowY: 'auto' },
  handle: { width: 36, height: 4, borderRadius: 2, background: '#E5E7EB', margin: '0 auto 20px' },
  centerScreen: { width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, sans-serif' },
  spinner: { width: 32, height: 32, border: '3px solid #E5E7EB', borderTopColor: '#111', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  appBanner: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
    background: '#111', padding: '10px 16px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', cursor: 'pointer',
  },
}