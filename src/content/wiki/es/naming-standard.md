---
title: Estándar de Nomenclatura
description: Una guía práctica para nombrar servidores y dispositivos de usuario en entornos locales, en la nube e híbridos.
slug: es/naming-standard
updatedDate: 2026-03-18
tags:
    - Infrastructura
    - SysAdmin
    - Mejores prácticas
---

## Introducción

Un esquema de nomenclatura consistente es la base de cualquier infraestructura gestionable. Sin él, identificar un servidor en un panel de monitorización, correlacionar un alerta con un activo en CMDB o automatizar el aprovisionamiento se convierte en una tarea propensa a errores que consume tiempo innecesario.

Este documento define el estándar oficial de nomenclatura de Yoruverse para todos los activos IT gestionados: servidores (físicos, virtuales y en la nube), equipos de red y endpoints de usuario. El estándar cubre tres aspectos fundamentales:

- **Estructura y sintaxis** de los nombres, garantizando compatibilidad con DNS (RFC 1034/1123), Active Directory y las principales herramientas de automatización (Terraform, Ansible).
- **Catálogo de códigos** para ubicación geográfica, plataforma, entorno y función, con criterios claros sobre cuándo y cómo usarlos.
- **Políticas de ciclo de vida**: cómo aprovisionar, renombrar, migrar y desmantelar activos manteniendo la integridad del inventario.

El documento se divide en tres partes: la **Parte I** trata la nomenclatura de servidores, la **Parte II** la de endpoints de usuario y la **Parte III** la gobernanza del estándar, incluyendo la política de migración para activos pre-existentes. Los anexos incluyen referencias normativas, la tabla de provincias españolas ISO 3166-2 y las expresiones regulares de validación listas para usar en pipelines CI/CD.

> Este estándar es de aplicación obligatoria para todos los equipos de IT de Yoruverse a partir de su publicación (versión 1.1, marzo 2026). Las dudas o solicitudes de nuevos códigos deben canalizarse a través del Comité de Nomenclatura (ver sección 18.2).

---

# PARTE I — Nomenclatura de Servidores

Aplica a todos los servidores (físicos, virtuales, en la nube) gestionados por Yoruverse. Los endpoints de usuario se tratan en la Parte II.

---

## 1. Objetivos del Estándar

- Identificación inequívoca de la ubicación geográfica, entorno, plataforma y función.
- Compatibilidad técnica con DNS (RFC 1034/1123), Active Directory y sistemas operativos modernos.
- Escalabilidad para crecimiento multirregión y multiprovedor.
- Estabilidad razonable: los cambios de ubicación geográfica sí requieren renombrar; los cambios de AZ, de host físico o las migraciones de hipervisor dentro de la misma ubicación no lo requieren.
- Compatible con automatización para CMDB, monitorización, IaC (Terraform/Ansible) y herramientas de seguridad.

---

## 2. Reglas Técnicas Generales

### 2.1 Sintaxis y Caracteres Permitidos

Los hostnames deben cumplir las especificaciones DNS (RFC 1034/1123):

- Caracteres permitidos: `a–z`, `0–9` e hyphen (`-`).
- Solo letras en minúscula (convención de insensibilidad a mayúsculas).
- Sin espacios, caracteres acentuados ni caracteres especiales.
- El hyphen no puede ser el primero ni el último carácter.
- Debe comenzar con una letra; debe terminar con una letra o dígito.

### 2.2 Límites de Longitud

- **Hostname (etiqueta):** máximo 63 caracteres (límite DNS RFC 1034).
- **FQDN completo:** máximo 255 caracteres.
- **Recomendación práctica:** 18–24 caracteres para el hostname.

### 2.3 Compatibilidad con Active Directory

Windows AD tiene un límite técnico estricto de **15 caracteres** para el atributo `sAMAccountName` de objetos de equipo (más el `$` final). Windows trunca automáticamente el hostname si supera este límite, generando riesgo de colisión.

**Solución adoptada:** un nombre corto para AD (ver sección 2.3.1). El FQDN completo del servidor se almacena en el atributo `description` del objeto AD y en CMDB.

### 2.3.1 Nombre Corto para Active Directory

Para resolver definitivamente la limitación de 15 caracteres, se define un nombre corto dedicado para el objeto de equipo en AD. Este nombre no reemplaza al hostname DNS; es el nombre que se usa para unir el servidor al dominio.

**Estructura:** `YRU-<PAÍS>SV-<ID>`

| Componente | Descripción |
|------------|-------------|
| `YRU` | Prefijo corporativo Yoruverse (la empresa del grupo propietaria del dominio). |
| `<PAÍS>` | Prefijo de código de país ISO 3166-2 del país donde el servidor está físicamente ubicado (`ES`, `PT`, `FR`…). Para servidores en regiones de nube genéricas, se usa el país del datacenter físico (p. ej., un nodo en `eus2` ubicado en Madrid → `ES`). |
| `SV` | Infijo fijo que identifica el objeto como servidor. Evita colisiones con objetos de equipo de endpoints de usuario en AD. |
| `<ID>` | Identificador alfanumérico aleatorio de 5 caracteres (A–Z, 0–9), en mayúsculas. 36⁵ = 60.466.176 combinaciones únicas por país. |

**Reglas de uso:**

- El nombre corto se genera una sola vez cuando el servidor se registra en AD y no cambia durante toda la vida útil del servidor, aunque cambie su rol, proveedor o ubicación.
- El **FQDN completo** del servidor se almacena en el atributo `description` del objeto AD y en CMDB como fuente de verdad operativa (p. ej., `es-m-dmg-prd-fsr-001.prd.es-m.dmg.yoruverse.local`). Usar el FQDN —no solo el hostname— permite identificar inequívocamente el entorno, la ubicación y el dominio directamente desde la consola AD, sin necesidad de consultar CMDB.
- Verificar que el `<ID>` generado no exista ya en AD antes de asignarlo.
- Registrar tanto el hostname completo como el nombre corto AD en CMDB.

**Atributo `dNSHostName` (gestionado automáticamente por Windows):**

Cuando un servidor se une al dominio, Windows rellena automáticamente el atributo `dNSHostName` con el nombre corto AD más el sufijo del dominio AD (p. ej., `YRU-ESSV-K2M9P.yoruverse.local`). Este atributo **no debe confundirse con el FQDN operativo** definido en la sección 3.2:

| Atributo | Ejemplo | Gestión | Uso |
|----------|---------|---------|-----|
| `dNSHostName` | `YRU-ESSV-K2M9P.yoruverse.local` | Automático (Windows) | Resolución interna por Kerberos / LDAP |
| `description` | `es-m-dmg-prd-fsr-001.prd.es-m.dmg.yoruverse.local` | Manual (según este estándar) | Identificación operativa en consola AD y CMDB |
| DNS FQDN (`yoruverse.com` o `yoruverse.local`) | `es-m-dmg-prd-fsr-001.prd.es-m.dmg.yoruverse.local` | DNS interno / Cloudflare | Acceso de red y monitorización |

> `dNSHostName` resuelve al nombre corto AD, no al hostname DNS largo. Los sistemas de monitorización y CMDB deben usar el FQDN DNS (del campo `description` o del registro CMDB), nunca `dNSHostName`, para referenciar el servidor.

### 2.4 Principios de Diseño

- **Consistencia:** misma estructura de campos y abreviaturas en toda la organización.
- **Descriptivo pero conciso:** solo atributos estables y operativamente relevantes.
- **Estabilidad:** evitar renombrar por cambios menores (cambio de AZ, host físico dentro de la misma ubicación). Los cambios de ubicación geográfica sí requieren renombrar.
- **Seguridad razonable:** no exponer información excesiva en DNS público; usar DNS interno para el detalle.
- **Unicidad:** cada hostname único durante toda la vida del recurso; no reutilizar nombres.
- **Separación de responsabilidades:** los atributos de negocio (BU, centro de coste, proyecto) pertenecen a CMDB/etiquetas, no al hostname.

---

## 3. Estructura del Nombre de Servidor

### 3.1 Patrón de Hostname

```
<LOC>-<PLT>-<ENV>-<ROL>-<NNN>
```

| Campo | Descripción | Longitud | Ejemplos |
|-------|-------------|----------|---------|
| `LOC` | Ubicación geográfica (ISO 3166-2 completo en minúsculas) | 4–6 chars | `es-m`, `es-b`, `pt-11`, `fr-75`, `euw1` |
| `PLT` | Plataforma / Proveedor | 3–4 chars | `dmg`, `aws`, `azr`, `gcp`, `onp` |
| `ENV` | Entorno | 3 chars | `prd`, `pre`, `tst`, `dev`, `lab` |
| `ROL` | Función | 2–4 chars | `app`, `web`, `dbs`, `api`, `mq` |
| `NNN` | Secuencia numérica | 3 dígitos | `001`, `002`, `099` |

**Ejemplo completo:**

```
es-m-onp-prd-dir-001
```

> ⚠️ **Advertencia — mayúsculas/minúsculas en el campo `LOC`:** en la Parte I (servidores), el campo `LOC` siempre va en **minúsculas** (`es-m`, `pt-11`). En la Parte II (endpoints de usuario), va en **mayúsculas** (`ES-M`, `PT-11`). Esta diferencia es intencionada y permite distinción visual entre ambos inventarios. Todos los pipelines de automatización deben aplicar la transformación de mayúsculas correcta según el tipo de activo. Ver Anexo C para las expresiones regulares de validación.

### 3.2 Patrón FQDN

```
<hostname>.<env>.<loc>.<proveedor>.<dominio_corporativo>
```

**Dominio corporativo:**

| Dominio | Uso | Gestión |
|---------|-----|---------|
| `yoruverse.com` | Zona pública y servicios con acceso a internet | Cloudflare |
| `yoruverse.local` | Zona interna de Active Directory (uso transitorio) | DNS del DC interno |

> ⚠️ **Nota de transición:** usar `.local` como sufijo de dominio AD no es recomendado por las buenas prácticas actuales (conflictos con mDNS/Bonjour, incompatibilidad con algunos servicios en la nube). El objetivo es migrar todos los registros internos a `yoruverse.com` con DNS split-horizon (ver sección 7.2). Hasta completar la migración, `yoruverse.local` sigue siendo un dominio interno válido y debe tenerse en cuenta en todas las herramientas de validación.

**Ejemplo (zona pública / yoruverse.com):**

```
es-m-onp-prd-dir-001.prd.es-m.onp.yoruverse.com
```

**Ejemplo (zona interna / yoruverse.local — uso transitorio):**

```
es-m-dmg-prd-fsr-001.prd.es-m.dmg.yoruverse.local
```

---

## 4. Códigos Estandarizados

### 4.1 Ubicación Geográfica (`LOC`) — ISO 3166-2 completo en minúsculas

Se usa el código ISO 3166-2 completo (incluyendo el prefijo de país) en minúsculas. Para regiones de nube genéricas (sin subdivisión geográfica específica), se usan códigos de región abreviados.

**Sitios actuales con infraestructura de servidores:**

| Código LOC | Ubicación | Código oficial ISO 3166-2 |
|------------|-----------|--------------------------|
| `es-m` | Madrid, España | ES-M |
| `es-b` | Barcelona, España | ES-B |
| `pt-11` | Lisboa, Portugal | PT-11 |
| `fr-75` | París, Francia | FR-75 |

**Regiones de nube genéricas:**

| Código | Descripción | País físico |
|--------|-------------|------------|
| `euw1` | Europe West 1 (eu-west-1) | Irlanda (Dublín) |
| `euw3` | Europe West 3 (eu-west-3) | Francia |
| `eus2` | Europe South 2 (eu-south-2) | España |
| `euc1` | Europe Central 1 (eu-central-1) | Alemania |
| `use1` | US East 1 (us-east-1) | Este de EE.UU. |
| `usw2` | US West 2 (us-west-2) | Oeste de EE.UU. |

> Cuando se usa un código de región de nube genérica como `LOC`, el campo `<PAÍS>` del nombre corto AD se determina por el país del datacenter físico (ver sección 2.3.1).

### 4.2 Plataforma / Proveedor (`PLT`)

| Código | Proveedor / Plataforma |
|--------|------------------------|
| `onp` | On-Premise (datacenter propio) — incluye servidores físicos y VMs cuando el hipervisor no es operativamente relevante |
| `dmg` | DMG Cloud |
| `aws` | Amazon Web Services |
| `azr` | Microsoft Azure |
| `gcp` | Google Cloud Platform |
| `vmw` | VMware vSphere — usar exclusivamente para hosts hipervisor VMware (ROL: `hvs`) |
| `kvm` | KVM / Proxmox — usar exclusivamente para hosts hipervisor KVM/Proxmox (ROL: `hvs`) |

> **Regla de uso `onp` vs `vmw`/`kvm`:** usar `onp` para todos los servidores on-premise (físicos y VMs). Reservar `vmw` y `kvm` exclusivamente para hosts hipervisor (ROL `hvs`), donde identificar la plataforma de virtualización tiene relevancia operativa directa. Las VMs que corren en esos hipervisores siguen usando `onp`.

### 4.3 Entorno (`ENV`)

| Código | Descripción |
|--------|-------------|
| `prd` | Producción |
| `pre` | Preproducción |
| `tst` | Testing / QA |
| `dev` | Desarrollo |
| `lab` | Laboratorio / PoC |

### 4.4 Función (`ROL`)

#### Aplicaciones y Backend

| Código | Descripción |
|--------|-------------|
| `app` | Servidor de aplicaciones general |
| `api` | API Backend / Microservicios |
| `web` | Servidor web (frontend) |
| `job` | Servidor de trabajos / batch |
| `mq` | Servidor de mensajería (RabbitMQ, Kafka) |

#### Bases de Datos

| Código | Descripción |
|--------|-------------|
| `dbs` | Servidor de base de datos |
| `dbc` | Clúster de base de datos |
| `rds` | Réplica de lectura de BD |

#### Infraestructura

| Código | Descripción |
|--------|-------------|
| `dir` | Directorio (Active Directory, LDAP) |
| `dns` | Servidor DNS |
| `dhcp` | Servidor DHCP |
| `vpn` | VPN Gateway (software) |
| `prx` | Proxy / Proxy inverso |
| `fwl` | Firewall de aplicación (software) |

#### Gestión y Monitorización

| Código | Descripción |
|--------|-------------|
| `mon` | Monitorización (Prometheus, Zabbix) |
| `log` | Logging centralizado (ELK, Graylog) |
| `cfg` | Configuración / Orquestación (Ansible, Puppet) |
| `bkp` | Servidor de backup |

#### Almacenamiento y Ficheros

| Código | Descripción |
|--------|-------------|
| `fsr` | Servidor de ficheros (SMB / NFS) |
| `nas` | NAS / Appliance de almacenamiento |
| `s3g` | Gateway de almacenamiento de objetos |

#### Virtualización y Contenedores

| Código | Descripción |
|--------|-------------|
| `hvs` | Servidor Hipervisor |
| `kmn` | Kubernetes Master / Control Plane |
| `kwn` | Kubernetes Worker Node |
| `dkr` | Docker Host |

#### Red y Seguridad

| Código | Descripción |
|--------|-------------|
| `rtr` | Router L3 |
| `swt` | Switch L2/L3 |
| `fwh` | Firewall Hardware |
| `vpnh` | VPN Gateway Hardware |
| `lbh` | Balanceador de carga Hardware |
| `pdu` | PDU (Unidad de Distribución de Energía) |
| `ups` | SAI |

### 4.5 Secuencia Numérica (`NNN`)

- Formato: `001`, `002`, `003`… `999` (siempre 3 dígitos, con ceros a la izquierda).
- **Rango válido: `001`–`999`. El valor `000` está explícitamente excluido** y no debe asignarse bajo ninguna circunstancia.
- Numeración por grupo lógico (función + ubicación + entorno).
- No reutilizar números dentro del mismo grupo tras el desmantelamiento.
- Reservar rangos según necesidad estimada (p. ej., `001–099` para nodos primarios, `101–199` para réplicas).

> ⚠️ **Nota operativa — LOC con un solo carácter tras el guión:** algunos códigos ISO 3166-2 producen segmentos de un solo carácter en el campo `LOC` (p. ej., `es-m` → Madrid, `es-b` → Barcelona, `es-a` → Alicante). Visualmente, el guión separador y el carácter de subdivisión pueden confundirse con un guión simple. Al construir o validar hostnames con estos códigos, prestar especial atención a asegurar que el LOC es `es-m` y no `es` o `m` de forma independiente. Los pipelines de validación deben cubrir explícitamente este caso (ver Anexo C).

---

## 5. Aplicación del Estándar por Tipo de Servidor

### 5.1 Servidores de Aplicaciones

```
es-m-dmg-prd-app-001.prd.es-m.dmg.yoruverse.com
es-m-dmg-prd-app-002.prd.es-m.dmg.yoruverse.com
eus2-aws-dev-api-001.dev.eus2.aws.yoruverse.com
```

### 5.2 Servidores de Base de Datos

**Nodos físicos:**

```
es-m-onp-prd-dbs-001.prd.es-m.onp.yoruverse.com
es-m-onp-prd-dbs-002.prd.es-m.onp.yoruverse.com
```

**Alias funcionales (CNAMEs):**

```
prd-db-writer.prd.es-m.onp.yoruverse.com → es-m-onp-prd-dbs-001
prd-db-reader.prd.es-m.onp.yoruverse.com → es-m-onp-prd-dbs-002
```

### 5.3 Servidores Web y con Balanceo de Carga

```
es-m-dmg-prd-web-001.prd.es-m.dmg.yoruverse.com
es-m-dmg-prd-web-002.prd.es-m.dmg.yoruverse.com
www.yoruverse.com → prd-web-vip.prd.es-m.dmg.yoruverse.com   (CNAME/VIP)
```

### 5.4 Infraestructura (AD, DNS, Monitorización)

```
es-m-onp-prd-dir-001.prd.es-m.onp.yoruverse.com
es-m-onp-prd-dns-001.prd.es-m.onp.yoruverse.com
es-m-dmg-prd-mon-001.prd.es-m.dmg.yoruverse.com
es-m-dmg-prd-bkp-001.prd.es-m.dmg.yoruverse.com
```

### 5.5 Hipervisores

```
es-m-onp-prd-hvs-001.prd.es-m.onp.yoruverse.com
es-m-vmw-prd-hvs-002.prd.es-m.vmw.yoruverse.com
```

### 5.6 Kubernetes / OpenShift

**Control plane:**

```
eus2-aws-prd-kmn-001.prd.eus2.aws.yoruverse.com
eus2-aws-prd-kmn-002.prd.eus2.aws.yoruverse.com
```

**Workers:**

```
eus2-aws-prd-kwn-001.prd.eus2.aws.yoruverse.com
eus2-aws-prd-kwn-002.prd.eus2.aws.yoruverse.com
```

### 5.7 Equipos de Red

Los equipos de red siguen el mismo patrón general: `<LOC>-<PLT>-<ENV>-<ROL>-<NNN>`. Un dispositivo de red puede estar on-premise o en la nube (p. ej., un router virtual en AWS).

```
es-m-onp-prd-rtr-001.prd.es-m.onp.yoruverse.com
es-m-onp-prd-swt-001.prd.es-m.onp.yoruverse.com
es-m-onp-prd-fwh-001.prd.es-m.onp.yoruverse.com
euw1-aws-prd-rtr-001.prd.euw1.aws.yoruverse.com
```

---

## 6. Políticas de Ciclo de Vida

### 6.1 Aprovisionamiento de Servidores

> **Nota:** el dominio de Active Directory interno es `yoruverse.local`. Los FQDNs internos usan `yoruverse.local` en lugar de `yoruverse.com`. La zona pública `yoruverse.com` se gestiona en Cloudflare para los servicios con acceso a internet.

1. **Automatización obligatoria:** usar scripts/IaC (Terraform, Ansible) que construyan el nombre según este estándar.
2. **Validación de unicidad:** verificar que el hostname completo no exista ya en CMDB.
3. **Generación del nombre corto AD:** generar `YRU-<PAÍS>SV-<ID>`, verificando que no existan colisiones en AD.
4. **Registro en CMDB** con estado `active`, IP, SO, proveedor, propietario, BU, centro de coste y proyecto. Registrar también el nombre corto AD.
5. **DNS:** crear registros A/AAAA en la zona apropiada según el dominio del servidor:
   - Servidores con FQDN en `yoruverse.com` → crear registro en Cloudflare.
   - Servidores con FQDN en `yoruverse.local` (zona interna, uso transitorio) → crear registro en el DNS del DC interno (Windows DNS). No crear registros `yoruverse.local` en Cloudflare.
6. **Unión a AD:** renombrar la máquina con el nombre corto antes de unirla al dominio. Almacenar el FQDN completo en el atributo `description` (p. ej., `es-m-dmg-prd-app-001.prd.es-m.dmg.yoruverse.com`).

### 6.2 Cambio de Ubicación Geográfica (renombrado obligatorio)

Si un servidor cambia de ubicación geográfica (código ISO 3166-2 diferente en `LOC`), debe renombrarse para reflejar la nueva ubicación.

1. Programar una ventana de mantenimiento.
2. Construir el nuevo hostname con el `LOC` actualizado.
3. Verificar la unicidad del nuevo nombre en CMDB.
4. Migrar los registros DNS (crear nuevo registro A; mantener el antiguo como CNAME temporal durante 30 días).
5. Renombrar el servidor en el SO. El nombre corto AD no cambia salvo que cambie el país.
6. Actualizar el hostname en CMDB, manteniendo el nombre anterior como referencia histórica.
7. Actualizar el atributo `description` en el objeto AD con el nuevo FQDN completo.
8. Actualizar referencias en sistemas dependientes (monitorización, backup, CMDB).
9. Verificar el correcto funcionamiento. Eliminar el CNAME antiguo tras el período de gracia.

> **Nota:** si el cambio de ubicación implica un cambio de país, se genera un nuevo nombre corto AD con el prefijo ISO 3166-2 del nuevo país.

### 6.3 Cambio de Función o Migración de Proveedor

- **Cambio de función permanente:** crear un nuevo servidor con el nombre correcto, migrar los servicios y desmantelar el antiguo.
- **Migración de proveedor:** crear un nuevo hostname con el `PLT` actualizado; usar CNAMEs funcionales para una transición transparente.

### 6.4 Desmantelamiento y Reciclaje

1. Marcar en CMDB: el estado pasa a `decommissioned` con fecha y motivo.
2. Conservar el histórico: mantener la asociación hostname–IP–servicio a efectos de auditoría.
3. Sin reutilización: el hostname queda retirado permanentemente.
4. DNS: eliminar los registros tras el período de gracia (30–90 días según política).
5. Excepciones: la reutilización requiere aprobación del Comité de Arquitectura y documentación explícita.

---

## 7. Gestión de DNS en Cloudflare

### 7.1 Estructura de Zonas

**Zona raíz:** `yoruverse.com`

**Subzonas delegadas por proveedor y entorno:**

```
prd.es-m.dmg.yoruverse.com       (Producción DMG Cloud Madrid)
dev.es-m.dmg.yoruverse.com       (Desarrollo DMG Cloud Madrid)
prd.eus2.aws.yoruverse.com       (Producción AWS EU South — Madrid)
prd.es-m.onp.yoruverse.com       (Producción On-Premise Madrid)
```

**Subzonas DNS internas (`yoruverse.local`) creadas en el DC:**

```
dmg.yoruverse.local              (DMG Cloud — DNS interno)
es-m.dmg.yoruverse.local         (DMG Cloud Madrid — DNS interno)
prd.es-m.dmg.yoruverse.local     (Producción DMG Cloud Madrid — DNS interno)
```

### 7.2 DNS Split-Horizon

1. Configurar Resolver Policies en Cloudflare Zero Trust › Gateway: si el **FQDN** pertenece a los subdominios `*.dmg.yoruverse.com` o `*.onp.yoruverse.com`, resolver vía DNS privado.
2. Para Enterprise: usar DNS › Internal DNS con vistas privadas.
3. Resultado: hostnames internos no visibles públicamente; resolución directa con IPs privadas.

---

## 8. Buenas Prácticas — Servidores

### 8.1 Qué Evitar en el Hostname

❌ Unidad de Negocio (BU) → va en CMDB/etiquetas cloud.
❌ Versiones de software (`sql2022`, `win2019`).
❌ Nombres de proyectos temporales.
❌ Información hardware específica (modelo, núcleos).
❌ Nombres creativos o de personajes.
❌ Inventar códigos no documentados en el estándar.
❌ Renombrar por cambios menores (cambio de AZ, migración de host físico dentro de la misma ubicación).
❌ Reutilizar hostnames desmantelados.

### 8.2 Qué Hacer

✅ Usar CNAMEs para nombres funcionales que puedan moverse entre nodos.
✅ Documentar las excepciones explícitamente con aprobación de Arquitectura.
✅ Validar nombres automáticamente en pipelines CI/CD.
✅ Mantener CMDB actualizado como fuente de verdad.
✅ Registrar el nombre corto AD junto al hostname DNS en CMDB.
✅ Usar `yoruverse.local` para registros DNS de servidores AD internos hasta completar la migración a `yoruverse.com` con split-horizon (ver secciones 3.2 y 7.2).
✅ Registrar el dominio en uso (`yoruverse.com` o `yoruverse.local`) en CMDB para facilitar la planificación de la migración.

---

## 9. Ejemplos Completos — Servidores

### Ejemplo 1: Servidor de Aplicaciones de Producción (Madrid, DMG Cloud)

| Campo | Valor |
|-------|-------|
| DNS Hostname | `es-m-dmg-prd-app-001` |
| FQDN | `es-m-dmg-prd-app-001.prd.es-m.dmg.yoruverse.com` |
| Nombre Corto AD | `YRU-ESSV-A1B2C` |
| sAMAccountName | `YRU-ESSV-A1B2C$` |
| Descripción AD | `es-m-dmg-prd-app-001.prd.es-m.dmg.yoruverse.com` |
| IP privada | `10.20.30.40` |
| SO | Windows Server 2022 |
| BU (en CMDB) | A3/ERP |
| Etiquetas cloud | `BU=a3erp, Environment=production, ManagedBy=terraform` |

### Ejemplo 2: Base de Datos PostgreSQL de Desarrollo (Madrid, On-Premise)

| Campo | Valor |
|-------|-------|
| DNS Hostname | `es-m-onp-dev-dbs-001` |
| FQDN | `es-m-onp-dev-dbs-001.dev.es-m.onp.yoruverse.com` |
| Nombre Corto AD | `YRU-ESSV-D4E5F` |
| sAMAccountName | `YRU-ESSV-D4E5F$` |
| Descripción AD | `es-m-onp-dev-dbs-001.dev.es-m.onp.yoruverse.com` |
| IP privada | `172.16.10.50` |
| SO | Ubuntu 22.04 LTS |
| BU (en CMDB) | Corporativo / IT Interno |

### Ejemplo 3: Kubernetes Worker AWS EU South (datacenter físico en España)

| Campo | Valor |
|-------|-------|
| DNS Hostname | `eus2-aws-prd-kwn-005` |
| FQDN | `eus2-aws-prd-kwn-005.prd.eus2.aws.yoruverse.com` |
| Nombre Corto AD | `YRU-ESSV-G7H8I` |
| sAMAccountName | `YRU-ESSV-G7H8I$` |
| Descripción AD | `eus2-aws-prd-kwn-005.prd.eus2.aws.yoruverse.com` |
| IP privada | `10.100.5.20` |
| SO | Amazon Linux 2 |
| BU (en CMDB) | Finanzas |
| Etiquetas AWS | `BU=finanzas, Environment=production, K8sCluster=prod-01` |

### Ejemplo 4: Router On-Premise (Madrid)

| Campo | Valor |
|-------|-------|
| DNS Hostname | `es-m-onp-prd-rtr-001` |
| FQDN | `es-m-onp-prd-rtr-001.prd.es-m.onp.yoruverse.com` |
| IP de gestión | `192.168.1.1` |
| Fabricante | Cisco |
| BU (en CMDB) | Infraestructura / Shared Services |

> **Nota:** los equipos de red con roles `rtr`, `swt`, `fwh`, `vpnh`, `lbh`, `pdu` y `ups` no se unen al dominio de Active Directory y por tanto no requieren nombre corto AD ni `sAMAccountName`. La gestión se realiza mediante credenciales locales o sistemas dedicados de gestión de red (NMS).

### Ejemplo 5: Servidor de Ficheros de Producción (Madrid, DMG Cloud)

| Campo | Valor |
|-------|-------|
| DNS Hostname | `es-m-dmg-prd-fsr-001` |
| FQDN | `es-m-dmg-prd-fsr-001.prd.es-m.dmg.yoruverse.local` |
| Nombre Corto AD | `YRU-ESSV-K2M9P` |
| sAMAccountName | `YRU-ESSV-K2M9P$` |
| Descripción AD | `es-m-dmg-prd-fsr-001.prd.es-m.dmg.yoruverse.local` |
| IP privada | `172.30.0.20` |
| SO | Windows Server |
| BU (en CMDB) | Infraestructura / IT Interno |

---

# PARTE II — Nomenclatura de Endpoints de Usuario

Aplica a todos los endpoints de usuario (portátiles, equipos de sobremesa, tabletas, teléfonos corporativos, etc.). Los servidores se tratan en la Parte I.

---

## 10. Patrón Base de Nomenclatura

```
YRU-<LOC>-<NNN>
```

| Campo | Descripción |
|-------|-------------|
| `YRU` | Prefijo corporativo Yoruverse (la empresa del grupo). |
| `<LOC>` | Código ISO 3166-2 completo en mayúsculas correspondiente al **sitio base** del empleado al que se asigna el dispositivo (p. ej., `ES-M` para Madrid, `ES-LE` para León, `PT-11` para Lisboa). |
| `<NNN>` | Contador numérico secuencial de 3 dígitos, global por sitio (LOC). Rango `001–999`. |

> **Sitio base vs. ubicación física:** `LOC` refleja el sitio organizativo al que pertenece el empleado, no dónde se encuentra el dispositivo en cada momento. Un trabajador remoto conserva el código de su sitio base. La ubicación física real se registra en CMDB y en el atributo `location` de AD cuando sea relevante para soporte o logística.

**Ejemplos:**

```
YRU-ES-M-001    (Dispositivo asignado a un empleado en el sitio de Madrid)
YRU-ES-LE-001   (Dispositivo asignado a un empleado en el sitio de León)
YRU-ES-B-001    (Dispositivo asignado a un empleado en el sitio de Barcelona)
YRU-PT-11-001   (Dispositivo asignado a un empleado en el sitio de Lisboa)
```

> El código `LOC` es el mismo estándar ISO 3166-2 que en servidores, en mayúsculas. Esto permite la referencia cruzada directa de datos CMDB entre ambos inventarios.

> ⚠️ **Advertencia — Diferencia de mayúsculas/minúsculas entre Parte I y Parte II:** el campo `LOC` se escribe en **minúsculas** en hostnames de servidores (`es-m`, `pt-11`) y en **mayúsculas** en nombres de endpoints de usuario (`ES-M`, `PT-11`). Esta diferencia es intencionada y ayuda a distinguir visualmente ambos inventarios, pero puede provocar errores si los nombres se construyen manualmente o en scripts que mezclan ambas convenciones. Todos los pipelines de automatización deben aplicar la transformación de mayúsculas correcta según el tipo de activo. Ver Anexo C para las expresiones regulares de validación.

---

## 11. Códigos de Campo — Endpoints de Usuario

### 11.1 Campo `LOC` (ISO 3166-2 completo en mayúsculas)

**Sitios actuales de Yoruverse:**

| Código LOC | Provincia / Ciudad |
|------------|-------------------|
| `ES-LE` | León |
| `ES-AV` | Ávila |
| `ES-M` | Madrid |
| `ES-O` | Asturias (Gijón) |
| `ES-B` | Barcelona |
| `ES-A` | Alicante |

**Expansión internacional (ejemplos):**

| Código LOC | Ciudad |
|------------|--------|
| `PT-11` | Lisboa, Portugal |
| `FR-75` | París, Francia |
| `DE-BE` | Berlín, Alemania |
| `IT-RM` | Roma, Italia |
| `GB-LND` | Londres, Reino Unido |

### 11.2 Campo `NNN` (Contador secuencial)

- Formato: `001` a `999`, siempre 3 dígitos, con ceros a la izquierda.
- **Rango válido: `001`–`999`. El valor `000` está explícitamente excluido** y no debe asignarse bajo ninguna circunstancia. Los sistemas de inventario y los pipelines de validación deben rechazar cualquier nombre que contenga `-000` como sufijo.
- El contador es global por sitio (`LOC`): todos los dispositivos en el mismo sitio comparten la misma serie numérica, independientemente del tipo de dispositivo.
- Mantener un registro centralizado del último NNN asignado por sitio.
- No reutilizar números de dispositivos desmantelados.

### 11.3 Tipo de Dispositivo (en CMDB y AD)

El tipo de dispositivo no forma parte del nombre del dispositivo. Se registra como atributo en CMDB y Active Directory:

| Tipo | Valor recomendado en CMDB / AD |
|------|-------------------------------|
| Portátil | `LP` |
| Sobremesa | `DT` |
| Workstation (alto rendimiento) | `WK` |
| Tableta | `TB` |
| Teléfono corporativo (móvil) | `PH` |
| All-in-One | `AIO` |
| Otro (casos especiales) | `OT` |

---

## 12. Compatibilidad con Active Directory — Endpoints de Usuario

El nuevo patrón `YRU-<LOC>-<NNN>` produce nombres que caben dentro del límite de 15 caracteres de `sAMAccountName` en la mayoría de los casos, eliminando el problema de truncado que existía con el patrón anterior.

| Nombre del dispositivo | Longitud | ¿Cabe en 15 chars? |
|------------------------|----------|--------------------|
| `YRU-ES-M-001` | 13 chars | ✅ Sin truncado |
| `YRU-ES-LE-001` | 14 chars | ✅ Sin truncado |
| `YRU-ES-AV-001` | 14 chars | ✅ Sin truncado |
| `YRU-PT-11-001` | 14 chars | ✅ Sin truncado |
| `YRU-GB-LND-001` | 15 chars | ✅ Sin truncado (límite exacto) |

El nombre del dispositivo se usa directamente como `cn` y `sAMAccountName` en AD sin necesidad de un nombre corto adicional.

---

## 13. Multisitio y Cambios de Ubicación

### 13.1 Regla General

- `LOC` representa el **sitio base** del empleado, no su ubicación física en cada momento.
- Un trabajador remoto o desplazado temporalmente **no provoca un renombrado** del dispositivo.
- Si el empleado cambia de sitio base de forma permanente (p. ej., traslado definitivo a otra oficina), el dispositivo **se renombra** para reflejar el nuevo sitio.
- La ubicación física real (domicilio, oficina del cliente, etc.) se registra en el atributo `location` de AD y en CMDB, pero no afecta al nombre del dispositivo.

### 13.2 Proceso de Renombrado por Cambio de Sitio Base

1. Confirmar que el traslado del empleado es permanente y aprobado por RRHH/IT.
2. Determinar el nuevo `LOC` y comprobar el siguiente `NNN` disponible para ese sitio.
3. Renombrar el dispositivo en el sistema operativo.
4. Ejecutar el renombrado en AD (consola ADUC o PowerShell).
5. Actualizar el atributo `location` de AD con el nuevo sitio.
6. Actualizar el inventario central: nuevo sitio, fecha de cambio y nombre anterior para trazabilidad.
7. Verificar la autenticación y que las herramientas de gestión (EDR, RMM) reconocen el cambio.

**Ejemplo:** empleado de León trasladado definitivamente a Ávila. Su portátil `YRU-ES-LE-015` se renombra a `YRU-ES-AV-004` (asumiendo que el último dispositivo registrado en Ávila era el 003).

---

## 14. Implementación en Active Directory — Endpoints de Usuario

### 14.1 Atributos AD Recomendados

| Atributo AD | Contenido |
|-------------|-----------|
| `description` | Nombre completo del dispositivo, usuario asignado, modelo, número de serie del fabricante. |
| `extensionAttribute1` | Tipo de dispositivo (`LP`, `DT`, `WK`, `TB`, `PH`, `AIO`, `OT`). |
| `location` / `physicalDeliveryOfficeName` | Ubicación física actual: sitio, edificio, planta, sala o "Remoto – domicilio". |
| `extensionAttribute2–15` | Datos personalizados: centro de coste, proyecto, etc. |

---

## 15. Ejemplos Completos — Endpoints de Usuario

| Nombre | Tipo (en CMDB/AD) | Sitio base |
|--------|-------------------|-----------|
| `YRU-ES-LE-001` | LP | León |
| `YRU-ES-LE-002` | DT | León |
| `YRU-ES-AV-001` | DT | Ávila |
| `YRU-ES-M-001` | LP | Madrid |
| `YRU-ES-M-002` | WK | Madrid |
| `YRU-ES-O-001` | LP | Gijón (Asturias) |
| `YRU-ES-B-001` | LP | Barcelona |
| `YRU-ES-B-002` | AIO | Barcelona |
| `YRU-ES-A-001` | TB | Alicante |
| `YRU-PT-11-001` | LP | Lisboa (Portugal) |
| `YRU-FR-75-001` | LP | París (Francia) |

---

## 16. Casos Especiales y Excepciones

- **Laboratorios y entornos de prueba:** prefijo `YRU-<LOC>-TST-<NNN>` (p. ej., `YRU-ES-M-TST-001`) seguido de un identificador libre, documentado en inventario. El campo `<LOC>` sigue el mismo formato ISO 3166-2 en mayúsculas que el resto de la Parte II.
- **Dispositivos temporales (préstamos, demos):** prefijo `YRU-<LOC>-TMP-<NNN>` (p. ej., `YRU-ES-LE-TMP-001`) hasta asignación definitiva a un empleado y sitio. El campo `<LOC>` indica el sitio de origen o almacenamiento.
- **Dispositivos de uso especial:** documentar la excepción en inventario con justificación y fecha.
- Cualquier excepción debe documentarse con el motivo y la aprobación del responsable IT.

> **Nota:** los nombres de excepción `TST` y `TMP` no pasan la regex estándar C.4 (que valida el patrón `YRU-<LOC>-<NNN>`). Deben validarse con un patrón de excepción dedicado y registrarse explícitamente en CMDB con el campo `name_type = exception`.

---

# PARTE III — Gobernanza

---

## 17. Política de Migración — Servidores Pre-Estándar

Esta sección regula el tratamiento de los servidores que existían antes de la publicación de este estándar (versión 1.1, marzo 2026) y que por tanto tienen nombres no conformes.

### 17.1 Clasificación de Servidores Pre-Estándar

Tras la publicación de este estándar, todos los servidores existentes deben inventariarse en CMDB con el campo `naming_compliance` con uno de los siguientes valores:

| Valor | Descripción |
|-------|-------------|
| `compliant` | El nombre cumple el estándar en todos sus campos. |
| `non_compliant` | El nombre no cumple el estándar (nombre libre, formato incorrecto, nombre corto AD no aleatorio, etc.). |
| `exempt` | El servidor ha sido declarado exento por el Comité de Nomenclatura con justificación documentada. |

### 17.2 Plan de Migración Progresiva

Los servidores `non_compliant` deben migrarse al nuevo estándar en un máximo de **6 meses** desde la fecha de publicación de este estándar (fecha límite: **17 de septiembre de 2026**), en el siguiente orden de prioridad:

| Prioridad | Criterio | Fecha límite |
|-----------|---------|--------------|
| 1 — Alta | Servidores de producción (`prd`) con nombres libres o ininteligibles | 2 meses (17/05/2026) |
| 2 — Media | Servidores de producción con nombres parcialmente conformes (p. ej., ID AD no aleatorio) | 4 meses (17/07/2026) |
| 3 — Baja | Servidores de entornos no productivos (`pre`, `tst`, `dev`, `lab`) | 6 meses (17/09/2026) |

**Durante el período de migración**, debe registrarse en CMDB para cada servidor `non_compliant`:
- `current_name`: el nombre actualmente en uso.
- `target_name`: el nombre conforme al estándar que tendrá tras la migración.
- `planned_migration_date`: fecha estimada de renombrado.
- `owner`: equipo o persona responsable de ejecutar el renombrado.

### 17.3 Proceso de Renombrado de Servidores Pre-Estándar

El renombrado sigue el mismo procedimiento que la sección 6.2 (Cambio de Ubicación Geográfica), con estas particularidades:

1. Calcular el nuevo hostname conforme al estándar a partir de los atributos actuales del servidor (LOC, PLT, ENV, ROL).
2. Si el nombre corto AD también es no conforme (p. ej., ID no aleatorio), generar uno nuevo según la sección 2.3.1 y registrar el nombre corto antiguo en CMDB como `previous_ad_short_name`.
3. Mantener el nombre antiguo como CNAME DNS un mínimo de 30 días para evitar romper servicios dependientes.
4. Actualizar el atributo `description` en AD con el nuevo FQDN completo.
5. Actualizar CMDB: `naming_compliance = compliant`, registrar nombre anterior y fecha de migración.

### 17.4 Exenciones

Los servidores que no puedan migrarse dentro del plazo establecido (p. ej., por dependencias críticas de aplicaciones, restricciones contractuales de soporte o servidores próximos a su desmantelamiento inminente) podrán ser declarados exentos por el Comité de Nomenclatura. Cada exención debe:
- Documentarse en CMDB con motivo, fecha de revisión y alternativa propuesta.
- Revisarse en cada ciclo de auditoría trimestral.
- Tener fecha de caducidad: si el servidor sigue activo tras su caducidad, la exención se reevalúa.

---

## 18. Gestión de Códigos y Gobernanza

### 18.1 Documento Maestro de Códigos

- **Ubicación:** repositorio Git corporativo + IT Wiki (https://wiki.yoruverse.com/naming-standard).
- **Contenido:** lista actualizada de todos los códigos aprobados (`LOC`, `PLT`, `ENV`, `ROL`), tabla de mapeo BU → etiqueta cloud, ejemplos por tipo de dispositivo, procedimiento para solicitar nuevos códigos e historial de cambios.

### 18.2 Comité de Nomenclatura

**Responsable:** equipo de Arquitectura / IT Platform.

**Responsabilidades:**
- Aprobar nuevos códigos y abreviaturas.
- Revisar periódicamente (trimestral) para retirar códigos obsoletos.
- Resolver conflictos o casos especiales.
- Actualizar la documentación y comunicar los cambios a todos los equipos afectados.

**Proceso de aprobación de nuevos códigos:**

1. Solicitud mediante ticket (Jira / ServiceNow).
2. Validación técnica: sin conflictos con códigos existentes, convención seguida.
3. Aprobación en reunión del comité.
4. Publicación en documento maestro y Wiki.
5. Comunicación a los equipos afectados.

### 18.3 Auditorías y Control de Cumplimiento

- Auditorías de cumplimiento trimestrales/semestrales.
- Informes periódicos sobre dispositivos con nombres no conformes.
- Formación obligatoria para nuevos miembros del equipo IT sobre el uso del estándar de nomenclatura.
- Documentar el proceso de renombrado en un SOP (Procedimiento Operativo Estándar).
- Etiquetar físicamente los endpoints de usuario con el nombre completo para identificación visual.

---

## Anexo A: Referencias Normativas

- RFC 1034 – Domain Names: Concepts and Facilities.
- RFC 1123 – Requirements for Internet Hosts.
- ISO 3166-2 – Codes for the representation of names of countries and their subdivisions.
- Microsoft Documentation – Active Directory sAMAccountName Attribute.
- Cloudflare DNS Documentation.
- Documentación interna de CMDB de Yoruverse.

---

## Anexo B: Tabla de Provincias Españolas (ISO 3166-2:ES)

Referencia completa de códigos para el campo `LOC` de sitios en España:

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

Este anexo proporciona patrones regex formales para validar los nombres definidos en este estándar. Están diseñados para uso directo en pipelines CI/CD (Terraform, Ansible), scripts de aprovisionamiento y herramientas de auditoría CMDB.

> **Convención:** todos los patrones se expresan como anclas completas (`^...$`) para evitar coincidencias parciales. Los ejemplos se muestran en sintaxis compatible con Python (`re`), JavaScript (`RegExp`) y herramientas POSIX ERE.

---

### C.1 Hostname de Servidor (Parte I)

**Patrón:** `<LOC>-<PLT>-<ENV>-<ROL>-<NNN>`

```
^(es-m|es-b|pt-11|fr-75|euw1|euw3|eus2|euc1|use1|usw2)-(onp|dmg|aws|azr|gcp|vmw|kvm)-(prd|pre|tst|dev|lab)-(app|api|web|job|mq|dbs|dbc|rds|dir|dns|dhcp|vpn|prx|fwl|mon|log|cfg|bkp|fsr|nas|s3g|hvs|kmn|kwn|dkr|rtr|swt|fwh|vpnh|lbh|pdu|ups)-([0-9]{3})$
```

**Restricciones adicionales aplicadas por esta regex:**

| Restricción | Aplicación |
|-------------|-----------|
| Solo minúsculas y guiones | Todos los segmentos en minúsculas; `[0-9]{3}` para NNN |
| `NNN` exactamente 3 dígitos | `[0-9]{3}` — rechaza `1`, `01`, `0001` |
| `NNN` != `000` | Validar programáticamente: `int(nnn) >= 1` tras capturar el grupo |
| Longitud total <= 63 chars | Validar programáticamente tras la coincidencia |

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

**Patrón:** `<hostname>.<env>.<loc>.<proveedor>.<dominio_corporativo>`

> **Dos dominios en uso (estado transitorio):** durante el período de migración de `yoruverse.local` a `yoruverse.com`, los validadores deben aceptar ambos sufijos. El dominio objetivo a largo plazo es `yoruverse.com` con DNS split-horizon (ver sección 3.2).

**Patrón de zona pública (`yoruverse.com`):**

```
^[a-z][a-z0-9-]{0,61}[a-z0-9]\.(prd|pre|tst|dev|lab)\.(es-m|es-b|pt-11|fr-75|euw1|euw3|eus2|euc1|use1|usw2)\.(onp|dmg|aws|azr|gcp|vmw|kvm)\.yoruverse\.com$
```

**Patrón de zona interna (`yoruverse.local` — uso transitorio):**

```
^[a-z][a-z0-9-]{0,61}[a-z0-9]\.(prd|pre|tst|dev|lab)\.(es-m|es-b|pt-11|fr-75|euw1|euw3|eus2|euc1|use1|usw2)\.(onp|dmg|aws|azr|gcp|vmw|kvm)\.yoruverse\.local$
```

**Notas:**

- El segmento de hostname (`[a-z][a-z0-9-]{0,61}[a-z0-9]`) sigue RFC 1034: empieza con letra, termina con letra o dígito, máximo 63 chars.
- Para validar la coherencia entre el ENV en el hostname y el ENV en la subzona, se recomienda dividir el FQDN por `.` y comparar los campos individualmente (ver C.1).
- La longitud total del FQDN no debe superar los 255 caracteres (validación programática).

**Ejemplo en Python:**

```python
import re

FQDN_COM_RE = re.compile(
    r'^[a-z][a-z0-9-]{0,61}[a-z0-9]'
    r'\.(prd|pre|tst|dev|lab)'
    r'\.(es-m|es-b|pt-11|fr-75|euw1|euw3|eus2|euc1|use1|usw2)'
    r'\.(onp|dmg|aws|azr|gcp|vmw|kvm)'
    r'\.yoruverse\.com$'
)

# Transitorio: válido mientras existan servidores en yoruverse.local
FQDN_LOCAL_RE = re.compile(
    r'^[a-z][a-z0-9-]{0,61}[a-z0-9]'
    r'\.(prd|pre|tst|dev|lab)'
    r'\.(es-m|es-b|pt-11|fr-75|euw1|euw3|eus2|euc1|use1|usw2)'
    r'\.(onp|dmg|aws|azr|gcp|vmw|kvm)'
    r'\.yoruverse\.local$'
)

def validate_fqdn(fqdn: str) -> bool:
    if len(fqdn) > 255:
        return False
    return bool(FQDN_COM_RE.match(fqdn) or FQDN_LOCAL_RE.match(fqdn))
```

---

### C.3 Nombre Corto AD — Servidores (Parte I)

**Patrón:** `YRU-<PAÍS2>SV-<ID5>`

```
^YRU-([A-Z]{2})SV-([A-Z0-9]{5})$
```

**Restricciones adicionales:**

| Restricción | Aplicación |
|-------------|-----------|
| Longitud total <= 15 chars | `YRU-` (4) + 2 + `SV-` (3) + 5 = 14 chars para países de 2 chars — siempre dentro del límite |
| `<PAÍS>` en lista aprobada | Validar contra: `ES`, `PT`, `FR`, `DE`, `GB`, `IT`, `IE`, `US` |
| `<ID>` único en AD | Verificación programática contra AD antes de asignar |

**Ejemplo en Python:**

```python
import re

AD_SHORT_SRV_RE = re.compile(r'^YRU-([A-Z]{2})SV-([A-Z0-9]{5})$')
VALID_COUNTRIES = {'ES', 'PT', 'FR', 'DE', 'GB', 'IT', 'IE', 'US'}

def validate_ad_short_server(name: str) -> bool:
    m = AD_SHORT_SRV_RE.match(name)
    if not m:
        return False
    return m.group(1) in VALID_COUNTRIES and len(name) <= 15
```

---

### C.4 Endpoint de Usuario (Parte II)

**Patrón:** `YRU-<LOC_MAYÚSCULAS>-<NNN>`

El campo `<LOC>` acepta códigos ISO 3166-2 de sitios aprobados. Dada su variabilidad, se recomienda validar LOC contra la tabla maestra en lugar de codificarlo en la regex. El patrón base valida la estructura:

```
^YRU-([A-Z]{2,3}-[A-Z0-9]{1,3})-([0-9]{3})$
```

> Este patrón cubre la forma ISO 3166-2 general (`XX-YY` o `XX-YYY`). Para validación estricta, complementar con la lista de sitios aprobados.

**Restricciones adicionales:**

| Restricción | Aplicación |
|-------------|-----------|
| `NNN` != `000` | `int(nnn) >= 1` tras capturar el grupo |
| Longitud total <= 15 chars | Validar `len(name) <= 15` |
| `LOC` en lista de sitios aprobados | Verificar contra la tabla maestra de `LOC` |

**Ejemplo en Python:**

```python
import re

USER_DEVICE_RE = re.compile(r'^YRU-([A-Z]{2,3}-[A-Z0-9]{1,3})-([0-9]{3})$')

APPROVED_LOC = {
    'ES-LE', 'ES-AV', 'ES-M', 'ES-O', 'ES-B', 'ES-A',
    'PT-11', 'FR-75', 'DE-BE', 'IT-RM', 'GB-LND',
    # Añadir nuevos sitios aquí tras aprobación del Comité de Nomenclatura
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
const USER_DEVICE_RE = /^YRU-([A-Z]{2,3}-[A-Z0-9]{1,3})-([0-9]{3})$/;
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

> Los patrones completos con todos los valores enumerados están en las secciones C.1–C.4. Esta tabla es solo un índice de referencia rápida.

| Ámbito | Patrón (esquemático — ver sección indicada) | Validaciones adicionales |
|--------|---------------------------------------------|--------------------------|
| Hostname de servidor | `^(LOC)-(PLT)-(ENV)-(ROL)-([0-9]{3})$` — ver **C.1** | `NNN >= 001`; longitud <= 63 |
| FQDN de servidor (`yoruverse.com`) | `^hostname.(ENV).(LOC).(PLT).yoruverse.com$` — ver **C.2** | Longitud <= 255; coherencia ENV hostname vs subzona |
| FQDN de servidor (`yoruverse.local`, transitorio) | `^hostname.(ENV).(LOC).(PLT).yoruverse.local$` — ver **C.2** | Longitud <= 255; coherencia ENV hostname vs subzona |
| Nombre corto AD de servidor | `^YRU-([A-Z]{2})SV-([A-Z0-9]{5})$` — ver **C.3** | País en lista aprobada; ID único en AD; longitud <= 15 |
| Endpoint de usuario | `^YRU-([A-Z]{2,3}-[A-Z0-9]{1,3})-([0-9]{3})$` — ver **C.4** | `NNN >= 001`; LOC en lista aprobada; longitud <= 15 |

> **Mantenimiento:** cuando se añadan nuevos códigos `LOC`, `PLT`, `ENV` o `ROL` al estándar, actualizar simultáneamente los patrones de este Anexo C y el documento maestro de códigos (sección 18.1). El Comité de Nomenclatura es responsable de mantener ambos sincronizados.
<!-- ---

## Anexo D: Historial de Cambios

| Versión | Fecha | Autor | Descripción |
|---------|-------|-------|-------------|
| 1.0 | 01/03/2026 | juan.cuellar@yoruverse.com | Versión interna inicial (borrador de trabajo, no distribuida). |
| 1.1 | 12/03/2026 | juan.cuellar@yoruverse.com | Primera versión publicada y distribuida. Estructura completa del estándar: Parte I (servidores), Parte II (endpoints de usuario) y Parte III (gobernanza). |
| 1.2 | 17/03/2026 | juan.cuellar@yoruverse.com | Servidor `es-m-dmg-prd-fsr-001` añadido. Subzonas DNS internas creadas: `dmg.yoruverse.local`, `es-m.dmg.yoruverse.local`, `prd.es-m.dmg.yoruverse.local`. Aclaración del dominio interno `yoruverse.local` vs dominio público `yoruverse.com`. |
| 1.3 | 17/03/2026 | juan.cuellar@yoruverse.com | Revisión de calidad preproducción: longitud LOC corregida (4–6 chars); ROL extendido a 2–4 chars para cubrir `mq`; `yoruverse.local` formalizado en el patrón FQDN (sección 3.2) y regex C.2 con nota de transición; criterio de uso `onp`/`vmw`/`kvm` aclarado en sección 4.2; región `euw1` corregida (solo Irlanda); Ejemplo 5 corregido (nombre corto AD aleatorio y campo `description`); paso 5 del aprovisionamiento de servidores diferenciado por dominio; sección 7.2 corregida (FQDN, no hostname); sección 16 migrada a LOC completo; nota sobre equipos de red sin AD; mejoras en sección 8.2 y Anexo C.5; versión 1.0 añadida al historial. |
| 1.4 | 17/03/2026 | juan.cuellar@yoruverse.com | Revisión basada en objeto AD real (servidor `YRU-ESSV-FSR01`): atributo `description` cambiado de hostname a FQDN completo en toda la documentación (secciones 2.3, 2.3.1, 6.1, 6.2 y todos los ejemplos de la sección 9); atributo `dNSHostName` documentado con tabla comparativa en sección 2.3.1; nueva sección 17 (Política de Migración de Servidores Pre-Estándar) con clasificación, plazos de migración progresivos, proceso de renombrado y política de exenciones; anterior sección 17 renumerada a sección 18. | -->
