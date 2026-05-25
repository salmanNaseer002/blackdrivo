export interface CompletionResult {
  percentage: number
  missing:    string[]
  completed:  string[]
}

export function calcDriverCompletion(driver: any, vehicle: any): CompletionResult {
  const checks = [
    { label: "Full name",           done: !!driver?.full_name && driver.full_name !== "PENDING" },
    { label: "Phone number",        done: !!driver?.phone },
    { label: "Date of birth",       done: !!driver?.dob },
    { label: "Home address",        done: !!driver?.home_address },
    { label: "Country & city",      done: !!driver?.country_code && !!driver?.city_code },
    { label: "License number",      done: !!driver?.license_number && driver.license_number !== "PENDING" },
    { label: "License expiry",      done: !!driver?.license_expiry },
    { label: "Background consent",  done: !!driver?.background_check_consent },
    { label: "Driver photo",        done: !!driver?.driver_photo_url },
    { label: "License front",       done: !!driver?.license_front_url },
    { label: "License back",        done: !!driver?.license_back_url },
    { label: "Vehicle added",       done: !!vehicle },
    { label: "Vehicle registration",done: !!vehicle?.reg_doc_url },
    { label: "Vehicle insurance",   done: !!vehicle?.insurance_url },
  ]
  const completed  = checks.filter(c => c.done).map(c => c.label)
  const missing    = checks.filter(c => !c.done).map(c => c.label)
  const percentage = Math.round((completed.length / checks.length) * 100)
  return { percentage, missing, completed }
}
