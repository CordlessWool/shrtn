# shrtn

![Version: 0.1.0](https://img.shields.io/badge/Version-0.1.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 2.5.1](https://img.shields.io/badge/AppVersion-2.5.1-informational?style=flat-square)

A Helm chart for shrtn

## Steps to Use a Helm Chart

### 1. Add a Helm Repository

Helm repositories contain collections of charts. You can add an existing repository using the following command:

```bash
helm repo add shrtn https://CordlessWool.github.io/shrtn
```

### 2. Install the Helm Chart

To install a chart, use the following command:

```bash
helm install my-shrtn shrtn/shrtn
```

### 3. View the Installation

You can check the status of the release using:

```bash
helm status my-shrtn
```

## Customizing the Chart

Helm charts come with default values, but you can customize them by using the --set flag or by providing a custom values.yaml file.

### 1. Using --set to Override Values
```bash
helm install my-shrtn shrtn/shrtn --set key1=value1,key2=value2
```

### 2. Using a values.yaml File
You can create a custom values.yaml file and pass it to the install command:

```bash
helm install my-shrtn shrtn/shrtn -f values.yaml
```

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| affinity | object | `{}` | Affinity rules |
| database.url | string | `""` | Database connection URL (e.g. Turso) |
| env | object | `{}` | Additional custom environment variables |
| fullnameOverride | string | `""` | Override full name of the chart |
| image.pullPolicy | string | `"IfNotPresent"` | Image pull policy |
| image.repository | string | `"cordlesswool/shrtn"` | Container image repository |
| image.tag | string | `""` | Image tag (defaults to chart appVersion) |
| imagePullSecrets | list | `[]` | Image pull secrets |
| ingress.annotations | object | `{}` | Ingress annotations |
| ingress.className | string | `""` | Ingress class name |
| ingress.enabled | bool | `false` | Enable ingress |
| ingress.hosts | list | `[{"host":"chart-example.local","paths":[{"path":"/","pathType":"ImplementationSpecific"}]}]` | Ingress hosts |
| ingress.tls | list | `[]` | TLS configuration |
| livenessProbe | object | `{"httpGet":{"path":"/","port":"http"}}` | Liveness probe |
| mail.from | string | `"noreply@example.com"` | From address used in emails |
| mail.mailgun.apiKey | string | `"your_mailgun_api_key"` | Mailgun API key |
| mail.mailgun.domain | string | `"your_mailgun_domain"` | Mailgun domain |
| mail.mailgun.url | string | `"https://api.mailgun.net"` | Mailgun API URL |
| mail.mailpit.domain | string | `"http://localhost:8025"` | Mailpit domain URL |
| mail.provider | string | `"smtp"` | Mail provider @description One of: none, smtp, mailgun, mailpit |
| mail.smtp.from | string | `"noreply@example.com"` | SMTP from address |
| mail.smtp.host | string | `"smtp.example.com"` | SMTP host |
| mail.smtp.pass | string | `"secure_password"` | SMTP password |
| mail.smtp.port | string | `"465"` | SMTP port |
| mail.smtp.user | string | `"noreply@example.com"` | SMTP username |
| nameOverride | string | `""` | Override name of the chart |
| nodeSelector | object | `{}` | Node selector |
| persistence.accessMode | string | `"ReadWriteOnce"` | Persistent volume access mode |
| persistence.size | string | `"1Gi"` | Persistent volume size |
| persistence.storageClass | string | `""` | Storage class to use (empty means default) |
| podAnnotations | object | `{}` | Pod annotations |
| podLabels | object | `{}` | Pod labels |
| podSecurityContext | object | `{}` | Pod security context |
| readinessProbe | object | `{"httpGet":{"path":"/","port":"http"}}` | Readiness probe |
| replicaCount | int | `1` | Number of replicas |
| resources | object | `{}` | Resource requests and limits |
| securityContext | object | `{}` | Container security context |
| service.port | int | `3001` | Service port |
| service.type | string | `"ClusterIP"` | Service type |
| serviceAccount.annotations | object | `{}` | Annotations for the service account |
| serviceAccount.automount | bool | `true` | Automount service account token |
| serviceAccount.create | bool | `true` | Create service account |
| serviceAccount.name | string | `""` | Service account name |
| shrtn.featurePrivateLinks | string | `"off"` | Enable private links feature @description PUBLIC_FEATURE_PRIVATE_LINKS: on | off |
| shrtn.instanceMode | string | `"PRIVATE"` | Instance mode @description PUBLIC_INSTANCE_MODE: PUBLIC_ONLY | PRIVATE |
| shrtn.origin | string | `"http://localhost:5173"` | Public origin base URL @description Base URL for the public-facing site, could also be provided by request headers |
| shrtn.ttl.temp | string | `"YEAR"` | Default TTL for temporary users @description Options: HOUR, DAY, WEEK, MONTH, YEAR, EVER |
| shrtn.ttl.user | string | `"EVER"` | Default TTL for authenticated users @description Options: HOUR, DAY, WEEK, MONTH, YEAR, EVER |
| tolerations | list | `[]` | Tolerations |
| volumeMounts | list | `[]` | Volume mounts |
| volumes | list | `[]` | Additional volumes |

----------------------------------------------
Autogenerated from chart metadata using [helm-docs v1.14.2](https://github.com/norwoodj/helm-docs/releases/v1.14.2)
