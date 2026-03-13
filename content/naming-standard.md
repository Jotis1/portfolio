# Estándar de Nomenclatura Yoruverse

**Empresa:** Yoruverse  
**Versión:** 1.1  
**Fecha:** 12 de marzo de 2026  
**Ámbito:** Todos los dispositivos Yoruverse (on-premise, cloud, usuario)  
**Equipo responsable:** Ciberseguridad / Plataforma IT  
**Contacto:** juan.cuellar@yoruverse.com  
**Wiki:** Sin definir

---
 
# PARTE I — Nomenclatura de Servidores
 
Aplica a todos los servidores (físicos, virtuales, cloud) gestionados por Yoruverse. Los equipos de usuario se cubren en la Parte II.
 
---
 
## 1. Objetivos del Estándar
 
- Identificación inequívoca de ubicación geográfica, entorno, plataforma y rol funcional.
- Compatibilidad técnica con DNS (RFC 1034/1123), Active Directory y sistemas operativos modernos.
- Escalabilidad para crecimiento multi-región y multi-proveedor.
- Estabilidad razonable: los cambios de ubicación geográfica sí requieren renombrado; los cambios de AZ, host físico o migración de hipervisor dentro de la misma ubicación, no.
- Automatización facilitada para CMDB, monitoreo, IaC (Terraform/Ansible) y seguridad.
 
---
 
## 2. Reglas Técnicas Generales
 
### 2.1 Sintaxis y Caracteres Permitidos
 
Los hostnames deben cumplir las especificaciones DNS (RFC 1034/1123):
 
- Caracteres permitidos: `a–z`, `0–9` y guion (`-`).
- Solo letras minúsculas (convención de insensibilidad a mayúsculas/minúsculas).
- Sin espacios, acentos, eñes ni caracteres especiales.
- No usar guion como primer ni último carácter.
- Comenzar con letra; terminar en letra o dígito.
 
### 2.2 Límites de Longitud
 
- **Hostname (label):** máximo 63 caracteres (límite DNS RFC 1034).
- **FQDN completo:** máximo 255 caracteres.
- **Recomendación práctica:** 18–24 caracteres para hostname.
 
### 2.3 Compatibilidad con Active Directory
 
Windows AD tiene una restricción técnica dura para el atributo `sAMAccountName` de cuentas de equipo: **15 caracteres** (más el `$` final). Windows trunca automáticamente el hostname si supera ese límite, generando riesgo de colisiones.
 
**Solución adoptada:** nombre corto para AD (ver sección 2.3.1). El hostname DNS largo se conserva en el atributo `description` del objeto AD y en CMDB.
 
### 2.3.1 Nombre Corto para Active Directory
 
Para resolver definitivamente la limitación de 15 caracteres, se define un nombre corto exclusivo para el objeto de equipo en AD. Este nombre no sustituye al hostname DNS; es el nombre con el que el servidor se une al dominio.
 
**Estructura:** `YOR-<PAIS>SV-<ID>`
 
| Componente | Descripción |
|------------|-------------|
| `YOR` | Prefijo corporativo Yoruverse (Yoruverse, empresa del grupo propietaria del dominio). |
| `<PAIS>` | Prefijo del código ISO 3166-2 del país donde está físicamente el servidor (`ES`, `PT`, `FR`…). Para servidores en regiones cloud genéricas, se usa el país del datacenter físico (p. ej., un nodo en `eus2` ubicado en Madrid → `ES`). |
| `SV` | Infijo fijo que identifica el objeto como servidor. Evita colisiones con objetos de equipo de usuario en AD. |
| `<ID>` | Identificador aleatorio de 5 caracteres alfanuméricos (A–Z, 0–9) en mayúsculas. 36⁵ = 60.466.176 combinaciones únicas por país. |
 
**Reglas de uso:**
 
- El nombre corto se genera una sola vez al dar de alta el servidor en AD y no cambia durante toda la vida del servidor, aunque cambie de rol, proveedor o ubicación.
- El hostname largo se conserva en el atributo `description` del objeto AD y en CMDB como fuente de verdad operativa.
- Verificar que el `<ID>` generado no existe ya en AD antes de asignarlo.
- Registrar en CMDB tanto el hostname completo como el nombre corto de AD.
 
### 2.4 Principios de Diseño
 
- **Consistencia:** misma estructura de campos y abreviaturas en toda la organización.
- **Descriptivo pero conciso:** solo atributos estables y relevantes operativamente.
- **Estabilidad:** evitar cambios de nombre por movimientos menores (cambio de AZ, host físico dentro de la misma ubicación). Los cambios de ubicación geográfica sí obligan a renombrado.
- **Seguridad razonable:** no exponer información excesiva en DNS público; usar DNS interno para el detalle.
- **Unicidad:** cada hostname único durante toda la vida del recurso; no reutilizar nombres.
- **Separación de concerns:** atributos de negocio (BU, centro de coste, proyecto) van en CMDB/etiquetas, no en hostname.
 
---
 
## 3. Estructura del Nombre de Servidor
 
### 3.1 Patrón de Hostname
 
```md
<LOC>-<PLT>-<ENV>-<ROL>-<NNN>
```
 
| Campo | Descripción | Longitud | Ejemplos |
|-------|-------------|----------|---------|
| `LOC` | Ubicación geográfica (ISO 3166-2 completo en minúsculas) | 4–7 chars | `es-m`, `es-b`, `pt-11`, `fr-75`, `euw1` |
| `PLT` | Plataforma / Proveedor | 3–4 chars | `dmg`, `aws`, `azr`, `gcp`, `onp` |
| `ENV` | Entorno | 3 chars | `prd`, `pre`, `tst`, `dev`, `lab` |
| `ROL` | Rol funcional | 3–4 chars | `app`, `web`, `dbs`, `api`, `dir` |
| `NNN` | Secuencia numérica | 3 dígitos | `001`, `002`, `099` |
 
**Ejemplo completo:**
 
```
es-m-onp-prd-dir-001
```
 
### 3.2 Patrón de FQDN
 
```
<hostname>.<env>.<loc>.<provider>.<dominio_corporativo>
```
 
**Ejemplo:**
 
```
es-m-onp-prd-dir-001.prd.es-m.onp.yoruverse.net
```
 
---
 
## 4. Códigos Estandarizados
 
### 4.1 Ubicación Geográfica (`LOC`) — ISO 3166-2 completo en minúsculas
 
Se usa el código ISO 3166-2 completo (incluyendo el prefijo de país) en minúsculas. Para regiones cloud genéricas (sin subdivisión geográfica concreta), se usan códigos de región abreviados.
 
**Sedes actuales con infraestructura de servidor:**
 
| Código LOC | Ubicación | Código ISO 3166-2 oficial |
|------------|-----------|--------------------------|
| `es-m` | Madrid, España | ES-M |
| `es-b` | Barcelona, España | ES-B |
| `pt-11` | Lisboa, Portugal | PT-11 |
| `fr-75` | París, Francia | FR-75 |
 
**Regiones cloud genéricas:**
 
| Código | Descripción | País físico real |
|--------|-------------|-----------------|
| `euw1` | Europa Oeste 1 (eu-west-1) | Irlanda / Reino Unido |
| `euw3` | Europa Oeste 3 (eu-west-3) | Francia |
| `eus2` | Europa Sur 2 (eu-south-2) | España |
| `euc1` | Europa Central 1 (eu-central-1) | Alemania |
| `use1` | US Este 1 (us-east-1) | EEUU Este |
| `usw2` | US Oeste 2 (us-west-2) | EEUU Oeste |
 
> Cuando se usa un código de región cloud genérico como `LOC`, el campo `<PAIS>` del nombre corto de AD se determina por el país físico real del datacenter (ver sección 2.3.1).
 
### 4.2 Plataforma / Proveedor (`PLT`)
 
| Código | Proveedor / Plataforma |
|--------|------------------------|
| `onp` | On-Premise (CPD propio) |
| `dmg` | DMG Cloud |
| `aws` | Amazon Web Services |
| `azr` | Microsoft Azure |
| `gcp` | Google Cloud Platform |
| `vmw` | VMware vSphere |
| `kvm` | KVM / Proxmox |
 
### 4.3 Entorno (`ENV`)
 
| Código | Descripción |
|--------|-------------|
| `prd` | Producción |
| `pre` | Preproducción |
| `tst` | Testing / QA |
| `dev` | Desarrollo |
| `lab` | Laboratorio / PoC |
 
### 4.4 Rol Funcional (`ROL`)
 
#### Aplicaciones y Backend
 
| Código | Descripción |
|--------|-------------|
| `app` | Servidor de aplicación general |
| `api` | Backend API / Microservicios |
| `web` | Servidor web (frontend) |
| `job` | Servidor de jobs / batch |
| `mq` | Servidor de mensajería (RabbitMQ, Kafka) |
 
#### Bases de Datos
 
| Código | Descripción |
|--------|-------------|
| `dbs` | Servidor de base de datos |
| `dbc` | Clúster de base de datos |
| `rds` | Réplica de lectura DB |
 
#### Infraestructura
 
| Código | Descripción |
|--------|-------------|
| `dir` | Directorio (Active Directory, LDAP) |
| `dns` | Servidor DNS |
| `dhcp` | Servidor DHCP |
| `vpn` | VPN Gateway (software) |
| `prx` | Proxy / Reverse Proxy |
| `fwl` | Firewall aplicativo (software) |
 
#### Gestión y Monitorización
 
| Código | Descripción |
|--------|-------------|
| `mon` | Monitorización (Prometheus, Zabbix) |
| `log` | Logs centralizados (ELK, Graylog) |
| `cfg` | Configuración / Orquestación (Ansible, Puppet) |
| `bkp` | Servidor de backup |
 
#### Almacenamiento y Ficheros
 
| Código | Descripción |
|--------|-------------|
| `fsr` | File Server (SMB / NFS) |
| `nas` | NAS / Storage Appliance |
| `s3g` | Object Storage Gateway |
 
#### Virtualización y Contenedores
 
| Código | Descripción |
|--------|-------------|
| `hvs` | Hypervisor Server |
| `kmn` | Kubernetes Master / Control Plane |
| `kwn` | Kubernetes Worker Node |
| `dkr` | Docker Host |
 
#### Red y Seguridad
 
| Código | Descripción |
|--------|-------------|
| `rtr` | Router L3 |
| `swt` | Switch L2/L3 |
| `fwh` | Firewall Hardware |
| `vpnh` | VPN Hardware Gateway |
| `lbh` | Load Balancer Hardware |
| `pdu` | PDU (Power Distribution Unit) |
| `ups` | SAI / UPS |
 
### 4.5 Secuencia Numérica (`NNN`)
 
- Formato: `001`, `002`, `003`… `999` (siempre 3 dígitos con ceros a la izquierda).
- **Rango válido: `001`–`999`. El valor `000` está explícitamente excluido** y no debe asignarse bajo ninguna circunstancia.
- Numeración por grupo lógico (rol + ubicación + entorno).
- No reutilizar números dentro del mismo grupo después de decomisión.
- Reservar rangos según necesidad estimada (p. ej., `001–099` para nodos principales, `101–199` para réplicas).

> ⚠️ **Nota operativa — LOC de un solo carácter tras el guion:** algunos códigos ISO 3166-2 producen segmentos de un solo carácter en el campo `LOC` (p. ej., `es-m` → Madrid, `es-b` → Barcelona, `es-a` → Alicante). Visualmente, el guion separador y el carácter de subdivisión pueden confundirse con un guion simple. Al construir o validar hostnames con estos códigos, prestar especial atención a que el LOC sea `es-m` y no `es` ni `m` de forma independiente. Los pipelines de validación deben cubrir esta casuística explícitamente (ver Anexo C).
 
---
 
## 5. Aplicación del Estándar por Tipo de Servidor
 
### 5.1 Servidores de Aplicación
 
```
es-m-dmg-prd-app-001.prd.es-m.dmg.yoruverse.net
es-m-dmg-prd-app-002.prd.es-m.dmg.yoruverse.net
eus2-aws-dev-api-001.dev.eus2.aws.yoruverse.net
```
 
### 5.2 Servidores de Base de Datos
 
**Nodos físicos:**
 
```
es-m-onp-prd-dbs-001.prd.es-m.onp.yoruverse.net
es-m-onp-prd-dbs-002.prd.es-m.onp.yoruverse.net
```
 
**Aliases funcionales (CNAMEs):**
 
```
prd-db-writer.prd.es-m.onp.yoruverse.net → es-m-onp-prd-dbs-001
prd-db-reader.prd.es-m.onp.yoruverse.net → es-m-onp-prd-dbs-002
```
 
### 5.3 Servidores Web y Balanceados
 
```
es-m-dmg-prd-web-001.prd.es-m.dmg.yoruverse.net
es-m-dmg-prd-web-002.prd.es-m.dmg.yoruverse.net
www.yoruverse.net → prd-web-vip.prd.es-m.dmg.yoruverse.net   (CNAME/VIP)
```
 
### 5.4 Infraestructura (AD, DNS, Monitorización)
 
```
es-m-onp-prd-dir-001.prd.es-m.onp.yoruverse.net
es-m-onp-prd-dns-001.prd.es-m.onp.yoruverse.net
es-m-dmg-prd-mon-001.prd.es-m.dmg.yoruverse.net
es-m-dmg-prd-bkp-001.prd.es-m.dmg.yoruverse.net
```
 
### 5.5 Hipervisores
 
```
es-m-onp-prd-hvs-001.prd.es-m.onp.yoruverse.net
es-m-vmw-prd-hvs-002.prd.es-m.vmw.yoruverse.net
```
 
### 5.6 Kubernetes / OpenShift
 
**Control plane:**
 
```
eus2-aws-prd-kmn-001.prd.eus2.aws.yoruverse.net
eus2-aws-prd-kmn-002.prd.eus2.aws.yoruverse.net
```
 
**Workers:**
 
```
eus2-aws-prd-kwn-001.prd.eus2.aws.yoruverse.net
eus2-aws-prd-kwn-002.prd.eus2.aws.yoruverse.net
```
 
### 5.7 Equipos de Red
 
Los equipos de red siguen el mismo patrón general: `<LOC>-<PLT>-<ENV>-<ROL>-<NNN>`. Un dispositivo de red puede ser on-premise o estar en cloud (p. ej., un router virtual en AWS).
 
```
es-m-onp-prd-rtr-001.prd.es-m.onp.yoruverse.net
es-m-onp-prd-swt-001.prd.es-m.onp.yoruverse.net
es-m-onp-prd-fwh-001.prd.es-m.onp.yoruverse.net
euw1-aws-prd-rtr-001.prd.euw1.aws.yoruverse.net
```
 
---
 
## 6. Políticas de Ciclo de Vida
 
### 6.1 Alta de Servidores
 
1. **Automatización obligatoria:** usar scripts/IaC (Terraform, Ansible) que construyan el nombre según este estándar.
2. **Validación de unicidad:** verificar que el hostname completo no existe en CMDB.
3. **Generación del nombre corto de AD:** generar `YOR-<PAIS>SV-<ID>` verificando que no existan colisiones en AD.
4. **Registro en CMDB** con estado `activo`, IP, SO, proveedor, propietario, BU, centro de coste y proyecto. Registrar también el nombre corto de AD.
5. **DNS:** crear registros A/AAAA en zona apropiada de Cloudflare.
6. **Unión a AD:** renombrar el equipo con el nombre corto antes de unir al dominio. Registrar el hostname largo en el atributo `description`.
 
### 6.2 Cambio de Ubicación Geográfica (renombrado obligatorio)
 
Si un servidor cambia de ubicación geográfica (diferente código ISO 3166-2 en `LOC`), se debe renombrar para reflejar la nueva ubicación.
 
1. Planificar ventana de mantenimiento.
2. Construir nuevo hostname con el `LOC` actualizado.
3. Verificar unicidad del nuevo nombre en CMDB.
4. Migrar registros DNS (crear nuevo registro A; mantener el antiguo como CNAME temporal durante 30 días).
5. Renombrar el servidor en SO. El nombre corto de AD no cambia salvo cambio de país.
6. Actualizar hostname en CMDB, conservando el nombre anterior como nombre histórico.
7. Actualizar el atributo `description` en el objeto AD con el nuevo hostname largo.
8. Actualizar referencias en sistemas dependientes (monitoreo, backup, CMDB).
9. Verificar funcionamiento. Eliminar CNAME antiguo tras el período de gracia.
 
> **Nota:** si el cambio de ubicación implica cambio de país, se genera un nuevo nombre corto de AD con el prefijo ISO 3166-2 del nuevo país.
 
### 6.3 Cambio de Rol o Migración de Proveedor
 
- **Cambio de rol permanente:** crear nuevo servidor con nombre correcto, migrar servicios, decomisionar anterior.
- **Migración de proveedor:** crear nuevo hostname con `PLT` actualizado; usar CNAMEs funcionales para transición transparente.
 
### 6.4 Decomisión y Reciclaje
 
1. Marcar en CMDB: estado cambia a `decomisionado` con fecha y motivo.
2. Retener histórico: conservar asociación hostname–IP–servicios para auditoría.
3. No reutilización: el hostname queda permanentemente retirado.
4. DNS: eliminar registros tras período de gracia (30–90 días según política).
5. Excepciones: reutilización requiere aprobación del Comité de Arquitectura y documentación explícita.
 
---
 
## 7. Gestión de DNS en Cloudflare
 
### 7.1 Estructura de Zonas
 
**Zona raíz:** `yoruverse.net`
 
**Subzonas delegadas por proveedor y entorno:**
 
```
prd.es-m.dmg.yoruverse.net       (Producción DMG Cloud Madrid)
dev.es-m.dmg.yoruverse.net       (Desarrollo DMG Cloud Madrid)
prd.eus2.aws.yoruverse.net       (Producción AWS EU South — Madrid)
prd.es-m.onp.yoruverse.net       (Producción On-Premise Madrid)
```
 
### 7.2 Split-Horizon DNS
 
1. Configurar Resolver Policies en Cloudflare Zero Trust › Gateway: si hostname contiene `dmg.yoruverse.net` u `onp.yoruverse.net`, resolver vía DNS privado.
2. Para Enterprise: usar DNS › Internal DNS con vistas privadas.
3. Resultado: hostnames internos no visibles públicamente; resolución directa con IPs privadas.
 
---
 
## 8. Buenas Prácticas — Servidores
 
### 8.1 Qué Evitar en el Hostname
 
❌ Unidad de Negocio (BU) → va en CMDB/etiquetas cloud.  
❌ Versiones de software (`sql2022`, `win2019`).  
❌ Nombres de proyectos temporales.  
❌ Información de hardware específico (modelo, cores).  
❌ Nombres creativos o de personajes.  
❌ Inventar códigos no documentados en el estándar.  
❌ Cambiar hostname por movimientos menores (cambio de AZ, migración de host físico dentro de la misma ubicación).  
❌ Reutilizar hostnames decomisionados.  
 
### 8.2 Qué Hacer
 
✅ Usar CNAMEs para nombres funcionales que pueden moverse entre nodos.  
✅ Documentar excepciones explícitamente con aprobación de Arquitectura.  
✅ Validar nombres automáticamente en pipelines CI/CD.  
✅ Mantener CMDB actualizada como fuente de verdad.  
✅ Registrar en CMDB el nombre corto de AD junto al hostname DNS.  
 
---
 
## 9. Ejemplos Completos — Servidores
 
### Ejemplo 1: Servidor de Aplicación Producción (Madrid, DMG Cloud)
 
| Campo | Valor |
|-------|-------|
| Hostname DNS | `es-m-dmg-prd-app-001` |
| FQDN | `es-m-dmg-prd-app-001.prd.es-m.dmg.yoruverse.net` |
| Nombre corto AD | `YOR-ESSV-A1B2C` |
| sAMAccountName | `YOR-ESSV-A1B2C$` |
| Descripción AD | `es-m-dmg-prd-app-001` |
| IP Privada | `10.20.30.40` |
| SO | Windows Server 2022 |
| BU (en CMDB) | A3/ERP |
| Etiquetas cloud | `BU=a3erp, Environment=production, ManagedBy=terraform` |
 
### Ejemplo 2: Base de Datos PostgreSQL Desarrollo (Madrid, On-Premise)
 
| Campo | Valor |
|-------|-------|
| Hostname DNS | `es-m-onp-dev-dbs-001` |
| FQDN | `es-m-onp-dev-dbs-001.dev.es-m.onp.yoruverse.net` |
| Nombre corto AD | `YOR-ESSV-D4E5F` |
| sAMAccountName | `YOR-ESSV-D4E5F$` |
| Descripción AD | `es-m-onp-dev-dbs-001` |
| IP Privada | `172.16.10.50` |
| SO | Ubuntu 22.04 LTS |
| BU (en CMDB) | Corporativo / IT Interno |
 
### Ejemplo 3: Kubernetes Worker AWS EU South (datacenter físico en España)
 
| Campo | Valor |
|-------|-------|
| Hostname DNS | `eus2-aws-prd-kwn-005` |
| FQDN | `eus2-aws-prd-kwn-005.prd.eus2.aws.yoruverse.net` |
| Nombre corto AD | `YOR-ESSV-G7H8I` |
| sAMAccountName | `YOR-ESSV-G7H8I$` |
| Descripción AD | `eus2-aws-prd-kwn-005` |
| IP Privada | `10.100.5.20` |
| SO | Amazon Linux 2 |
| BU (en CMDB) | Finanzas |
| Etiquetas AWS | `BU=finanzas, Environment=production, K8sCluster=prod-01` |
 
### Ejemplo 4: Router On-Premise (Madrid)
 
| Campo | Valor |
|-------|-------|
| Hostname DNS | `es-m-onp-prd-rtr-001` |
| FQDN | `es-m-onp-prd-rtr-001.prd.es-m.onp.yoruverse.net` |
| IP Gestión | `192.168.1.1` |
| Fabricante | Cisco |
| BU (en CMDB) | Infraestructura / Shared Services |
 
---
 
# PARTE II — Nomenclatura de Equipos de Usuario
 
Aplica a todos los equipos de usuario (portátiles, sobremesas, tablets, teléfonos corporativos, etc.). Los servidores se cubren en la Parte I.
 
---
 
## 10. Nomenclatura Base
 
```
YOR-<LOC>-<NNN>
```
 
| Campo | Descripción |
|-------|-------------|
| `YOR` | Prefijo corporativo Yoruverse (Yoruverse, empresa del grupo). |
| `<LOC>` | Código ISO 3166-2 completo en mayúsculas correspondiente a la **sede de adscripción** del empleado al que está asignado el equipo (p. ej., `ES-M` para Madrid, `ES-LE` para León, `PT-11` para Lisboa). |
| `<NNN>` | Contador numérico secuencial de 3 dígitos global por sede (LOC). Rango `001–999`. |
 
> **Sede de adscripción vs. ubicación física:** `LOC` refleja la sede organizativa a la que pertenece el empleado, no dónde está el equipo en cada momento. Un trabajador en remoto conserva el código de su sede de referencia. La ubicación física real se registra en CMDB y en el atributo `location` de AD si es relevante para soporte o logística.
 
**Ejemplos:**
 
```
YOR-ES-M-001    (Equipo asignado a empleado de la sede de Madrid)
YOR-ES-LE-001   (Equipo asignado a empleado de la sede de León)
YOR-ES-B-001    (Equipo asignado a empleado de la sede de Barcelona)
YOR-PT-11-001   (Equipo asignado a empleado de la sede de Lisboa)
```
 
> El código `LOC` es el mismo estándar ISO 3166-2 que en servidores, en mayúsculas. Esto permite cruzar datos de CMDB entre ambos inventarios de forma directa.

> ⚠️ **Advertencia — Diferencia de capitalización entre Parte I y Parte II:** el campo `LOC` se escribe en **minúsculas** en hostnames de servidor (`es-m`, `pt-11`) y en **mayúsculas** en nombres de equipo de usuario (`ES-M`, `PT-11`). Esta diferencia es intencionada y facilita distinguir visualmente ambos inventarios, pero puede provocar errores si se construyen nombres de forma manual o en scripts que mezclan ambas convenciones. Todos los pipelines de automatización deben aplicar la transformación de mayúsculas/minúsculas según el tipo de activo. Véase Anexo C para expresiones regulares de validación.
 
---
 
## 11. Códigos de Campo — Equipos de Usuario
 
### 11.1 Campo `LOC` (ISO 3166-2 completo en mayúsculas)
 
**Sedes actuales Yoruverse:**
 
| Código LOC | Provincia / Ciudad |
|------------|--------------------|
| `ES-LE` | León |
| `ES-AV` | Ávila |
| `ES-M` | Madrid |
| `ES-O` | Asturias (Gijón) |
| `ES-B` | Barcelona |
| `ES-A` | Alicante |
 
**Expansión internacional (ejemplos):**
 
| Código LOC | Localidad |
|------------|-----------|
| `PT-11` | Lisboa, Portugal |
| `FR-75` | París, Francia |
| `DE-BE` | Berlín, Alemania |
| `IT-RM` | Roma, Italia |
| `GB-LND` | Londres, Reino Unido |
 
### 11.2 Campo `NNN` (Contador secuencial)
 
- Formato: `001` a `999`, siempre 3 dígitos con ceros a la izquierda.
- **Rango válido: `001`–`999`. El valor `000` está explícitamente excluido** y no debe asignarse bajo ninguna circunstancia. Los sistemas de inventario y los pipelines de validación deben rechazar cualquier nombre que contenga `-000` como sufijo.
- El contador es global por sede (`LOC`): todos los equipos de una misma sede comparten la misma serie numérica, independientemente del tipo de dispositivo.
- Mantener un registro centralizado del último NNN asignado por sede.
- No reutilizar números de equipos decomisionados.
 
### 11.3 Tipo de Dispositivo (en CMDB y AD)
 
El tipo de dispositivo no forma parte del nombre del equipo. Se registra como atributo en CMDB y en Active Directory:
 
| Tipo | Valor recomendado en CMDB / AD |
|------|-------------------------------|
| Laptop / Portátil | `LP` |
| Desktop / Sobremesa | `DT` |
| Workstation (alto rendimiento) | `WK` |
| Tablet | `TB` |
| Teléfono corporativo (móvil) | `PH` |
| All-in-One | `AIO` |
| Otros (casos especiales) | `OT` |
 
---
 
## 12. Compatibilidad con Active Directory — Equipos de Usuario
 
El nuevo patrón `YOR-<LOC>-<NNN>` produce nombres que caben dentro del límite de 15 caracteres de `sAMAccountName` en la mayoría de casos, eliminando el problema de truncado que existía con el patrón anterior.
 
| Nombre de equipo | Longitud | ¿Entra en 15 chars? |
|------------------|----------|---------------------|
| `YOR-ES-M-001` | 13 chars | ✅ Sin truncado |
| `YOR-ES-LE-001` | 14 chars | ✅ Sin truncado |
| `YOR-ES-AV-001` | 14 chars | ✅ Sin truncado |
| `YOR-PT-11-001` | 14 chars | ✅ Sin truncado |
| `YOR-GB-LND-001` | 15 chars | ✅ Sin truncado (límite exacto) |
 
El nombre del equipo se usa directamente como `cn` y `sAMAccountName` en AD sin necesidad de nombre corto adicional.
 
---
 
## 13. Multisede y Movimientos entre Ubicaciones
 
### 13.1 Regla General
 
- `LOC` representa la **sede de adscripción** del empleado, no su ubicación física en cada momento.
- Un trabajador en remoto o desplazado temporalmente **no provoca renombrado** del equipo.
- Si el empleado cambia de sede de adscripción de forma permanente (p. ej., traslado definitivo a otra delegación), el equipo **se renombra** para reflejar la nueva sede.
- La ubicación física real (domicilio, oficina de cliente, etc.) se registra en el atributo `location` de AD y en CMDB, pero no afecta al nombre del equipo.
 
### 13.2 Proceso de Renombrado por Cambio de Sede de Adscripción
 
1. Confirmar que el traslado del empleado es permanente y aprobado por RRHH/IT.
2. Determinar el nuevo `LOC` y consultar el siguiente `NNN` disponible para esa sede.
3. Renombrar el equipo en el sistema operativo.
4. Ejecutar el renombrado en AD (consola ADUC o PowerShell).
5. Actualizar el atributo `location` en AD con la nueva sede.
6. Actualizar el inventario central: nueva sede, fecha de cambio y nombre anterior para trazabilidad.
7. Verificar autenticación y que las herramientas de gestión (EDR, RMM) reconocen el cambio.
 
**Ejemplo:** empleado de León trasladado definitivamente a Ávila. Su portátil `YOR-ES-LE-015` pasa a llamarse `YOR-ES-AV-004` (asumiendo que el último equipo registrado en Ávila era el 003).
 
---
 
## 14. Implementación en Active Directory — Equipos de Usuario
 
### 14.1 Atributos AD Recomendados
 
| Atributo AD | Contenido |
|-------------|-----------|
| `description` | Nombre completo del equipo, usuario asignado, modelo, número de serie del fabricante. |
| `extensionAttribute1` | Tipo de dispositivo (`LP`, `DT`, `WK`, `TB`, `PH`, `AIO`, `OT`). |
| `location` / `physicalDeliveryOfficeName` | Ubicación física actual: sede, edificio, planta, sala o "Remoto – domicilio". |
| `extensionAttribute2–15` | Datos personalizados: centro de coste, proyecto, etc. |
 
---
 
## 15. Ejemplos Completos — Equipos de Usuario
 
| Nombre | Tipo (en CMDB/AD) | Sede de adscripción |
|--------|-------------------|---------------------|
| `YOR-ES-LE-001` | LP | León |
| `YOR-ES-LE-002` | DT | León |
| `YOR-ES-AV-001` | DT | Ávila |
| `YOR-ES-M-001` | LP | Madrid |
| `YOR-ES-M-002` | WK | Madrid |
| `YOR-ES-O-001` | LP | Gijón (Asturias) |
| `YOR-ES-B-001` | LP | Barcelona |
| `YOR-ES-B-002` | AIO | Barcelona |
| `YOR-ES-A-001` | TB | Alicante |
| `YOR-PT-11-001` | LP | Lisboa (Portugal) |
| `YOR-FR-75-001` | LP | París (Francia) |
 
---
 
## 16. Casos Especiales y Excepciones
 
- **Laboratorios y entornos de prueba:** prefijo `YOR-<PAIS>-TST-<NNN>` seguido de identificador libre, documentado en inventario.
- **Equipos temporales (préstamos, demos):** prefijo `YOR-<PAIS>-TMP-<NNN>` hasta asignación definitiva a un empleado y sede.
- **Equipos de propósito especial:** documentar excepción en inventario con justificación y fecha.
- Cualquier excepción debe documentarse con el motivo y aprobación del responsable de IT.
 
---
 
# PARTE III — Gobernanza
 
---
 
## 17. Gestión de Abreviaturas y Gobernanza
 
### 17.1 Documento Maestro de Códigos
 
- **Ubicación:** repositorio Git corporativo + Wiki de IT (https://wiki.yoruverse.net/naming-standard).
- **Contenido:** lista actualizada de todos los códigos aprobados (`LOC`, `PLT`, `ENV`, `ROL`), tabla de mapeo BU → etiquetas cloud, ejemplos por tipo de dispositivo, procedimiento para solicitar nuevos códigos e histórico de cambios.
 
### 17.2 Comité de Nomenclatura
 
**Responsables:** Equipo de Arquitectura / Plataforma IT.
 
**Funciones:**
- Aprobar nuevos códigos y abreviaturas.
- Revisar periódicamente (trimestral) para retirar códigos obsoletos.
- Resolver conflictos o casos especiales.
- Actualizar documentación y comunicar cambios a todos los equipos afectados.
 
**Proceso de aprobación de nuevos códigos:**
 
1. Solicitud vía ticket (Jira / ServiceNow).
2. Validación técnica: sin conflictos con códigos existentes, convención seguida.
3. Aprobación en reunión de comité.
4. Publicación en documento maestro y Wiki.
5. Comunicación a equipos afectados.
 
### 17.3 Auditorías y Control de Cumplimiento
 
- Auditorías de conformidad trimestrales/semestrales.
- Informes periódicos de dispositivos con nombres no conformes.
- Formación obligatoria a nuevos miembros del equipo de IT sobre el uso de la nomenclatura.
- Documentar el proceso de renombrado en un SOP (Standard Operating Procedure).
- Etiquetar físicamente los equipos de usuario con el nombre completo para identificación visual.
 
---
 
## Anexo A: Referencias Normativas
 
- RFC 1034 – Domain Names: Concepts and Facilities.
- RFC 1123 – Requirements for Internet Hosts.
- ISO 3166-2 – Codes for the representation of names of countries and their subdivisions.
- Microsoft Documentation – Active Directory sAMAccountName Attribute.
- Cloudflare DNS Documentation.
- Documentación interna CMDB Yoruverse.
 
---
 
## Anexo B: Tabla de Provincias Españolas (ISO 3166-2:ES)
 
Referencia completa de códigos para el campo `LOC` con sede en España:
 
| ISO 3166-2 | Provincia | ISO 3166-2 | Provincia |
|------------|-----------|------------|-----------|
| `ES-VI` | Álava | `ES-M` | Madrid |
| `ES-AB` | Albacete | `ES-MA` | Málaga |
| `ES-A` | Alicante | `ES-MU` | Murcia |
| `ES-AL` | Almería | `ES-NA` | Navarra |
| `ES-AV` | Ávila | `ES-OR` | Ourense |
| `ES-BA` | Badajoz | `ES-O` | Asturias |
| `ES-PM` | Illes Balears | `ES-P` | Palencia |
| `ES-B` | Barcelona | `ES-GC` | Las Palmas |
| `ES-BU` | Burgos | `ES-PO` | Pontevedra |
| `ES-CC` | Cáceres | `ES-SA` | Salamanca |
| `ES-CA` | Cádiz | `ES-TF` | S.C. Tenerife |
| `ES-CS` | Castellón | `ES-S` | Cantabria |
| `ES-CR` | Ciudad Real | `ES-SG` | Segovia |
| `ES-CO` | Córdoba | `ES-SE` | Sevilla |
| `ES-C` | A Coruña | `ES-SO` | Soria |
| `ES-CU` | Cuenca | `ES-T` | Tarragona |
| `ES-GI` | Girona | `ES-TE` | Teruel |
| `ES-GR` | Granada | `ES-TO` | Toledo |
| `ES-GU` | Guadalajara | `ES-V` | Valencia |
| `ES-SS` | Gipuzkoa | `ES-VA` | Valladolid |
| `ES-H` | Huelva | `ES-BI` | Bizkaia |
| `ES-HU` | Huesca | `ES-ZA` | Zamora |
| `ES-J` | Jaén | `ES-Z` | Zaragoza |
| `ES-LE` | León | `ES-CE` | Ceuta |
| `ES-L` | Lleida | `ES-ML` | Melilla |
| `ES-LO` | La Rioja | | |
| `ES-LU` | Lugo | | |

---

## Anexo C: Expresiones Regulares de Validación

Este anexo proporciona patrones regex formales para validar los nombres definidos en este estándar. Están diseñados para su uso directo en pipelines CI/CD (Terraform, Ansible), scripts de aprovisionamiento y herramientas de auditoría de CMDB.

> **Convención:** todos los patrones se expresan como anclas completas (`^...$`) para evitar coincidencias parciales. Los ejemplos se muestran en sintaxis compatible con Python (`re`), JavaScript (`RegExp`) y herramientas POSIX ERE.

---

### C.1 Hostname de Servidor (Parte I)

**Patrón:** `<LOC>-<PLT>-<ENV>-<ROL>-<NNN>`

```
^(es-m|es-b|pt-11|fr-75|euw1|euw3|eus2|euc1|use1|usw2)-(onp|dmg|aws|azr|gcp|vmw|kvm)-(prd|pre|tst|dev|lab)-(app|api|web|job|mq|dbs|dbc|rds|dir|dns|dhcp|vpn|prx|fwl|mon|log|cfg|bkp|fsr|nas|s3g|hvs|kmn|kwn|dkr|rtr|swt|fwh|vpnh|lbh|pdu|ups)-([0-9]{3})$
```

**Restricciones adicionales aplicadas por este regex:**

| Restricción | Aplicación |
|-------------|------------|
| Solo minúsculas y guiones | Todos los segmentos en minúsculas; `[0-9]{3}` para NNN |
| `NNN` de exactamente 3 dígitos | `[0-9]{3}` — rechaza `1`, `01`, `0001` |
| `NNN` != `000` | Validar programáticamente: `int(nnn) >= 1` tras capturar el grupo |
| Longitud total <= 63 chars | Validar programáticamente tras el match |

**Ejemplo de uso en Python:**

```python
import re

HOSTNAME_RE = re.compile(
    r'^(es-m|es-b|pt-11|fr-75|euw1|euw3|eus2|euc1|use1|usw2)'
    r'-(onp|dmg|aws|azr|gcp|vmw|kvm)'
    r'-(prd|pre|tst|dev|lab)'
    r'-(app|api|web|job|mq|dbs|dbc|rds|dir|dns|dhcp|vpn|prx|fwl'
    r'|mon|log|cfg|bkp|fsr|nas|s3g|hvs|kmn|kwn|dkr|rtr|swt|fwh|vpnh|lbh|pdu|ups)'
    r'-([0-9]{3})$'
)

def validate_server_hostname(name: str) -> bool:
    m = HOSTNAME_RE.match(name)
    if not m:
        return False
    nnn = int(m.group(5))
    return 1 <= nnn <= 999 and len(name) <= 63
```

**Ejemplo de uso en JavaScript:**

```javascript
const HOSTNAME_RE = /^(es-m|es-b|pt-11|fr-75|euw1|euw3|eus2|euc1|use1|usw2)-(onp|dmg|aws|azr|gcp|vmw|kvm)-(prd|pre|tst|dev|lab)-(app|api|web|job|mq|dbs|dbc|rds|dir|dns|dhcp|vpn|prx|fwl|mon|log|cfg|bkp|fsr|nas|s3g|hvs|kmn|kwn|dkr|rtr|swt|fwh|vpnh|lbh|pdu|ups)-([0-9]{3})$/;

function validateServerHostname(name) {
  const m = name.match(HOSTNAME_RE);
  if (!m) return false;
  const nnn = parseInt(m[5], 10);
  return nnn >= 1 && nnn <= 999 && name.length <= 63;
}
```

---

### C.2 FQDN de Servidor (Parte I)

**Patrón:** `<hostname>.<env>.<loc>.<provider>.<dominio_corporativo>`

```
^[a-z][a-z0-9-]{0,61}[a-z0-9]\.(prd|pre|tst|dev|lab)\.(es-m|es-b|pt-11|fr-75|euw1|euw3|eus2|euc1|use1|usw2)\.(onp|dmg|aws|azr|gcp|vmw|kvm)\.yoruverse\.net$
```

**Notas:**

- El segmento del hostname (`[a-z][a-z0-9-]{0,61}[a-z0-9]`) sigue RFC 1034: empieza por letra, termina en letra o dígito, maximo 63 chars.
- Para validar la coherencia entre el ENV del hostname y el ENV de la subzona, se recomienda descomponer el FQDN por `.` y comparar los campos individualmente (ver C.1).
- La longitud total del FQDN no debe superar 255 caracteres (validación programática).

**Ejemplo en Python:**

```python
import re

FQDN_RE = re.compile(
    r'^[a-z][a-z0-9-]{0,61}[a-z0-9]'
    r'\.(prd|pre|tst|dev|lab)'
    r'\.(es-m|es-b|pt-11|fr-75|euw1|euw3|eus2|euc1|use1|usw2)'
    r'\.(onp|dmg|aws|azr|gcp|vmw|kvm)'
    r'\.yoruverse\.net$'
)

def validate_fqdn(fqdn: str) -> bool:
    return bool(FQDN_RE.match(fqdn)) and len(fqdn) <= 255
```

---

### C.3 Nombre Corto AD — Servidores (Parte I)

**Patrón:** `YOR-<PAIS2>SV-<ID5>`

```
^YOR-([A-Z]{2})SV-([A-Z0-9]{5})$
```

**Restricciones adicionales:**

| Restricción | Aplicación |
|-------------|------------|
| Longitud total <= 15 chars | `YOR-` (4) + 2 + `SV-` (3) + 5 = 14 chars con paises de 2 chars — siempre dentro del limite |
| `<PAIS>` en lista aprobada | Validar contra: `ES`, `PT`, `FR`, `DE`, `GB`, `IT`, `IE`, `US` |
| `<ID>` unico en AD | Verificación programática contra AD antes de asignar |

**Ejemplo en Python:**

```python
import re

AD_SHORT_SRV_RE = re.compile(r'^YOR-([A-Z]{2})SV-([A-Z0-9]{5})$')
VALID_COUNTRIES = {'ES', 'PT', 'FR', 'DE', 'GB', 'IT', 'IE', 'US'}

def validate_ad_short_server(name: str) -> bool:
    m = AD_SHORT_SRV_RE.match(name)
    if not m:
        return False
    return m.group(1) in VALID_COUNTRIES and len(name) <= 15
```

---

### C.4 Equipo de Usuario (Parte II)

**Patrón:** `YOR-<LOC_MAYUS>-<NNN>`

El campo `<LOC>` admite los códigos ISO 3166-2 de las sedes aprobadas. Por su variabilidad, se recomienda validar el LOC contra la tabla maestra en lugar de codificarlo en el regex. El patrón base valida la estructura:

```
^YOR-([A-Z]{2,3}-[A-Z0-9]{1,3})-([0-9]{3})$
```

> Este patrón cubre la forma general ISO 3166-2 (`XX-YY` o `XX-YYY`). Para validación estricta, complementar con la lista de sedes aprobadas.

**Restricciones adicionales:**

| Restricción | Aplicación |
|-------------|------------|
| `NNN` != `000` | `int(nnn) >= 1` tras capturar el grupo |
| Longitud total <= 15 chars | Validar `len(name) <= 15` |
| `LOC` en lista de sedes aprobadas | Verificar contra tabla maestra de `LOC` |

**Ejemplo en Python:**

```python
import re

USER_DEVICE_RE = re.compile(r'^YOR-([A-Z]{2,3}-[A-Z0-9]{1,3})-([0-9]{3})$')

APPROVED_LOC = {
    'ES-LE', 'ES-AV', 'ES-M', 'ES-O', 'ES-B', 'ES-A',
    'PT-11', 'FR-75', 'DE-BE', 'IT-RM', 'GB-LND',
    # Anadir nuevas sedes aqui tras aprobacion del Comite de Nomenclatura
}

def validate_user_device(name: str) -> bool:
    m = USER_DEVICE_RE.match(name)
    if not m:
        return False
    loc = m.group(1)
    nnn = int(m.group(2))
    return loc in APPROVED_LOC and nnn >= 1 and len(name) <= 15
```

**Ejemplo en JavaScript:**

```javascript
const USER_DEVICE_RE = /^YOR-([A-Z]{2,3}-[A-Z0-9]{1,3})-([0-9]{3})$/;
const APPROVED_LOC = new Set(['ES-LE','ES-AV','ES-M','ES-O','ES-B','ES-A','PT-11','FR-75','DE-BE','IT-RM','GB-LND']);

function validateUserDevice(name) {
  const m = name.match(USER_DEVICE_RE);
  if (!m) return false;
  const nnn = parseInt(m[2], 10);
  return APPROVED_LOC.has(m[1]) && nnn >= 1 && name.length <= 15;
}
```

---

### C.5 Resumen de Patrones

| Ambito | Regex base | Validaciones adicionales |
|--------|-----------|--------------------------|
| Hostname servidor | `^(LOC)-(PLT)-(ENV)-(ROL)-([0-9]{3})$` | `NNN >= 001`; longitud <= 63 |
| FQDN servidor | `^hostname\.(ENV)\.(LOC)\.(PLT)\.yoruverse\.net$` | Longitud <= 255; coherencia ENV hostname vs subzona |
| Nombre corto AD servidor | `^YOR-([A-Z]{2})SV-([A-Z0-9]{5})$` | Pais en lista aprobada; ID unico en AD; longitud <= 15 |
| Equipo de usuario | `^YOR-([A-Z]{2,3}-[A-Z0-9]{1,3})-([0-9]{3})$` | `NNN >= 001`; LOC en lista aprobada; longitud <= 15 |

> **Mantenimiento:** cuando se añadan nuevos códigos `LOC`, `PLT`, `ENV` o `ROL` al estándar, actualizar simultáneamente los patrones de este Anexo C y el documento maestro de códigos (sección 17.1). El Comité de Nomenclatura es responsable de mantener la sincronía entre ambos.