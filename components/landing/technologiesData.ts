export interface TechItem {
  name: string;
  icon: string; 
}

export interface TechCategory {
  title: string;
  items: TechItem[];
}

export const technologiesData: TechCategory[] = [
  {
    title: "Backend",
    items: [
      { name: ".Net", icon: "/icons/dot-net.svg" },
      { name: "PHP", icon: "/icons/php.webp" },
      { name: "Python", icon: "/icons/python.svg" },
      { name: "Rails", icon: "/icons/rails.svg" },
      { name: "Rust", icon: "/icons/rust.svg" },
      { name: "Node", icon: "/icons/node.svg" },
      { name: "Scala", icon: "/icons/scala.svg" },
      { name: "Golang", icon: "/icons/golang-gopher.svg" },
      { name: "Laravel", icon: "/icons/laravel.svg" },
      { name: "Express Js", icon: "/icons/express.svg" },
      { name: "CakePHP", icon: "/icons/cakephp.svg" },
      { name: "Django", icon: "/icons/django.svg" },
      { name: "CodeIgniter", icon: "/icons/codeigniter.svg" },
    ],
  },
  {
    title: "Frontend",
    items: [
      { name: "Html 5", icon: "/icons/html-5.svg" },
      { name: "Css", icon: "/icons/css-3.svg" },
      { name: "React", icon: "/icons/react.svg" },
      { name: "Next.js", icon: "/icons/nextjs.webp" },
      { name: "Angular", icon: "/icons/angular.svg" },
      { name: "Vue.js", icon: "/icons/vue.svg" },
      { name: "TailwindCSS", icon: "/icons/tailwind-css.png" },
      { name: "Bootstrap", icon: "/icons/bootstrap.svg" },
      { name: "Ajax", icon: "/icons/ajax.svg" },
      { name: "Jquery", icon: "/icons/jquery.svg" },
      { name: "VBScript", icon: "/icons/vbscript.svg" },
    ],
  },
  {
    title: "Mobile",
    items: [
      { name: "Android", icon: "/icons/android.svg" },
      { name: "iOS", icon: "/icons/ios.svg" },
      { name: "React Native", icon: "/icons/react-native.svg" },
      { name: "Flutter", icon: "/icons/flutter.svg" },
      { name: "Swift", icon: "/icons/swift.svg" },
      { name: "Kotlin", icon: "/icons/kotlin.svg" },
      { name: "Ionic", icon: "/icons/ionic.svg" },
      { name: "Xamarin", icon: "/icons/xamarin.svg" },
    ],
  },
  {
    title: "Databases",
    items: [
      { name: "MySQL", icon: "/icons/mysql.svg" },
      { name: "Microsoft SQL", icon: "/icons/microsoft-sql.svg" },
      { name: "PostgreSQL", icon: "/icons/postgresql.svg" },
      { name: "MongoDB", icon: "/icons/mongodb.svg" },
      { name: "Oracle Database", icon: "/icons/oracle.svg" },
      { name: "Firebase", icon: "/icons/firebase.svg" },
      { name: "Azure SQL", icon: "/icons/sql-azure.svg" },
      { name: "Cassandra", icon: "/icons/cassandra.svg" },
    ],
  },
  {
    title: "CMS",
    items: [
      { name: "WordPress", icon: "/icons/wordpress.svg" },
      { name: "Joomla", icon: "/icons/joomla.svg" },
      { name: "Magento", icon: "/icons/magento.svg" },
      { name: "Drupal", icon: "/icons/drupal.svg" },
      { name: "SharePoint", icon: "/icons/sharepoint.svg" },
    ],
  },
  {
    title: "Cloud",
    items: [
      { name: "Microsoft Azure", icon: "/icons/azure.svg" },
      { name: "AWS", icon: "/icons/aws.svg" },
      { name: "Google Cloud", icon: "/icons/google-cloud.svg" },
      { name: "Digital Ocean", icon: "/icons/digital-ocean.svg" },
      { name: "Mule Soft", icon: "/icons/mulesoft.svg" },
    ],
  },
  {
    title: "Testing Tools",
    items: [
      { name: "Selenium", icon: "/icons/selenium.svg" },
      { name: "Cucumber", icon: "/icons/cucumber.svg" },
      { name: "Postman", icon: "/icons/postman.svg" },
      { name: "Apiary", icon: "/icons/apiary.svg" },
      { name: "JUnit", icon: "/icons/junit.svg" },
      { name: "NUnit", icon: "/icons/nunit.svg" },
      { name: "PHPUnit", icon: "/icons/phpunit.svg" },
      { name: "SonarQube", icon: "/icons/sonarqube.svg" },
      { name: "Codecov", icon: "/icons/Codecov.svg" },
      { name: "Sauce labs", icon: "/icons/saucelabs.svg" },
      { name: "Browser Stack", icon: "/icons/browserstack-ar21.svg" },
      { name: "Amazon", icon: "/icons/amazon.svg" },
    ],
  },
  {
    title: "DevOps",
    items: [
      { name: "Docker", icon: "/icons/docker.svg" },
      { name: "Bitbucket", icon: "/icons/bitbucket.svg" },
      { name: "GitLab", icon: "/icons/gitlab.svg" },
      { name: "Kubernetes", icon: "/icons/kubernets.svg" },
      { name: "Appdynamics", icon: "/icons/appdynamics.svg" },
      { name: "GitHub", icon: "/icons/github-icon-1.svg" },
      { name: "Jenkins", icon: "/icons/jenkin.svg" },
      { name: "Splunk", icon: "/icons/splunk.svg" },
      { name: "Datadog", icon: "/icons/datadog.svg" },
      { name: "Appvance.ai", icon: "/icons/appvance.svg" },
    ],
  },
  {
    title: "Full Stacks",
    items: [
      { name: "Mean", icon: "/icons/mean.svg" },
      { name: "Mern", icon: "/icons/mern.svg" },
      { name: "Lamp", icon: "/icons/lamp.svg" },
      { name: "Python", icon: "/icons/python.svg" },
      { name: "Golang", icon: "/icons/golang-gopher.svg" },
      { name: "Rust", icon: "/icons/rust.svg" },
      { name: ".Net", icon: "/icons/dot-net.svg" },
      { name: "PHP", icon: "/icons/php.webp" },
      { name: "Node", icon: "/icons/node.svg" },
      { name: "Angular", icon: "/icons/angular.svg" },
      { name: "Vue", icon: "/icons/vue.svg" },
      { name: "React", icon: "/icons/react.svg" },
    ],
  },
  {
    title: "Blockchain",
    items: [
      { name: "Solidity", icon: "/icons/solidity.svg" },
      { name: "Rust", icon: "/icons/rust.svg" },
      { name: "Truffle", icon: "/icons/truffle.svg" },
      { name: "Hardhat", icon: "/icons/hardhat.svg" },
      { name: "Remix", icon: "/icons/remix.svg" },
      { name: "Defi", icon: "/icons/defi.svg" },
      { name: "Dex", icon: "/icons/dex.svg" },
      { name: "Launchpad", icon: "/icons/launchpad.svg" },
      { name: "Ethereum", icon: "/icons/ethereum.svg" },
      { name: "Binance", icon: "/icons/binance.svg" },
      { name: "Fantom", icon: "/icons/fantom.svg" },
      { name: "Matic", icon: "/icons/MATIC.svg" },
      { name: "Terra", icon: "/icons/terra.svg" },
      { name: "Solana", icon: "/icons/solana.svg" },

    ],
  },
];