---
title: Naming Standard
description: A practical guide to naming servers and user devices across on-premise, cloud, and hybrid environments.
slug: naming-standard
updatedDate: 2026-03-18
tags:
    - Infrastructure
    - SysAdmin
    - Best practices
---

## Introduction

A consistent naming scheme is the foundation of any manageable infrastructure. Without it, identifying a server in a monitoring dashboard, correlating an alert with a CMDB asset, or automating provisioning becomes an error-prone task that wastes unnecessary time.

This document defines Yoruverse's official naming standard for all managed IT assets: servers (physical, virtual, and cloud), network equipment, and user endpoints. The standard covers three fundamental aspects:

- **Structure and syntax** of names, ensuring compatibility with DNS (RFC 1034/1123), Active Directory, and major automation tools (Terraform, Ansible).
- **Code catalogue** for geographic location, platform, environment, and functional role, with clear criteria on when and how to use each.
- **Lifecycle policies**: how to provision, rename, migrate, and decommission assets while maintaining inventory integrity.

The document is divided into three parts: **Part I** covers server naming, **Part II** user endpoint naming, and **Part III** standard governance, including the migration policy for pre-existing assets. The annexes include normative references, the Spanish provinces ISO 3166-2 table, and validation regular expressions ready for use in CI/CD pipelines.

> This standard is mandatory for all Yoruverse IT teams from its publication date (version 1.1, March 2026). Questions or requests for new codes must be submitted through the Naming Committee (see section 18.2).

---

# PART I — Server Naming

Applies to all servers (physical, virtual, cloud) managed by Yoruverse. User endpoints are covered in Part II.
 
---
 
## 1. Standard Objectives
 
- Unambiguous identification of geographic location, environment, platform, and functional role.
- Technical compatibility with DNS (RFC 1034/1123), Active Directory, and modern operating systems.
- Scalability for multi-region and multi-provider growth.
- Reasonable stability: geographic location changes do require renaming; AZ changes, physical host changes, or hypervisor migrations within the same location do not.
- Automation-friendly for CMDB, monitoring, IaC (Terraform/Ansible), and security tooling.
 
---
 
## 2. General Technical Rules
 
### 2.1 Syntax and Allowed Characters
 
Hostnames must comply with DNS specifications (RFC 1034/1123):
 
- Allowed characters: `a–z`, `0–9`, and hyphen (`-`).
- Lowercase letters only (case-insensitivity convention).
- No spaces, accented characters, or special characters.
- Hyphen must not be the first or last character.
- Must start with a letter; must end with a letter or digit.
 
### 2.2 Length Limits
 
- **Hostname (label):** maximum 63 characters (DNS RFC 1034 limit).
- **Full FQDN:** maximum 255 characters.
- **Practical recommendation:** 18–24 characters for hostname.
 
### 2.3 Active Directory Compatibility
 
Windows AD has a hard technical limit of **15 characters** for the `sAMAccountName` attribute of computer accounts (plus the trailing `$`). Windows automatically truncates the hostname if it exceeds this limit, creating collision risk.
 
**Adopted solution:** a short name for AD (see section 2.3.1). The server's full FQDN is stored in the AD object's `description` attribute and in CMDB.
 
### 2.3.1 Short Name for Active Directory
 
To definitively resolve the 15-character limitation, a dedicated short name is defined for the AD computer object. This name does not replace the DNS hostname; it is the name used to join the server to the domain.
 
**Structure:** `YRU-<COUNTRY>SV-<ID>`
 
| Component | Description |
|------------|-------------|
| `YRU` | Yoruverse corporate prefix (the group company owning the domain). |
| `<COUNTRY>` | ISO 3166-2 country code prefix for the country where the server is physically located (`ES`, `PT`, `FR`…). For servers in generic cloud regions, use the physical datacenter country (e.g., a node in `eus2` located in Madrid → `ES`). |
| `SV` | Fixed infix identifying the object as a server. Prevents collisions with user endpoint computer objects in AD. |
| `<ID>` | Random 5-character alphanumeric identifier (A–Z, 0–9), uppercase. 36⁵ = 60,466,176 unique combinations per country. |
 
**Usage rules:**

- The short name is generated once when the server is registered in AD and does not change throughout the server's lifetime, even if its role, provider, or location changes.
- The server's **full FQDN** is stored in the AD object's `description` attribute and in CMDB as the operational source of truth (e.g., `es-m-dmg-prd-fsr-001.prd.es-m.dmg.yoruverse.local`). Using the FQDN — not just the hostname — allows unambiguous identification of the environment, location, and domain directly from the AD console, without needing to query CMDB.
- Verify that the generated `<ID>` does not already exist in AD before assigning it.
- Register both the full hostname and the AD short name in CMDB.

**`dNSHostName` attribute (automatically managed by Windows):**

When a server joins the domain, Windows automatically populates the `dNSHostName` attribute with the AD short name plus the AD domain suffix (e.g., `YRU-ESSV-K2M9P.yoruverse.local`). This attribute **must not be confused with the operational FQDN** defined in section 3.2:

| Attribute | Example | Management | Use |
|----------|---------|---------|-----|
| `dNSHostName` | `YRU-ESSV-K2M9P.yoruverse.local` | Automatic (Windows) | Internal resolution by Kerberos / LDAP |
| `description` | `es-m-dmg-prd-fsr-001.prd.es-m.dmg.yoruverse.local` | Manual (per this standard) | Operational identification in AD console and CMDB |
| DNS FQDN (`yoruverse.com` or `yoruverse.local`) | `es-m-dmg-prd-fsr-001.prd.es-m.dmg.yoruverse.local` | Internal DNS / Cloudflare | Network access and monitoring |

> `dNSHostName` resolves to the AD short name, not the long DNS hostname. Monitoring systems and CMDB must use the DNS FQDN (from the `description` field or CMDB record), never `dNSHostName`, to reference the server.
 
### 2.4 Design Principles
 
- **Consistency:** same field structure and abbreviations across the entire organisation.
- **Descriptive but concise:** only stable, operationally relevant attributes.
- **Stability:** avoid renaming for minor changes (AZ change, physical host within the same location). Geographic location changes do require renaming.
- **Reasonable security:** do not expose excessive information in public DNS; use internal DNS for detail.
- **Uniqueness:** each hostname unique throughout the resource's lifetime; do not reuse names.
- **Separation of concerns:** business attributes (BU, cost centre, project) belong in CMDB/tags, not in the hostname.
 
---
 
## 3. Server Name Structure
 
### 3.1 Hostname Pattern
 
```
<LOC>-<PLT>-<ENV>-<ROL>-<NNN>
```
 
| Field | Description | Length | Examples |
|-------|-------------|----------|---------|
| `LOC` | Geographic location (full ISO 3166-2 in lowercase) | 4–6 chars | `es-m`, `es-b`, `pt-11`, `fr-75`, `euw1` |
| `PLT` | Platform / Provider | 3–4 chars | `dmg`, `aws`, `azr`, `gcp`, `onp` |
| `ENV` | Environment | 3 chars | `prd`, `pre`, `tst`, `dev`, `lab` |
| `ROL` | Functional role | 2–4 chars | `app`, `web`, `dbs`, `api`, `mq` |
| `NNN` | Numeric sequence | 3 digits | `001`, `002`, `099` |
 
**Full example:**
 
```
es-m-onp-prd-dir-001
```

> ⚠️ **Warning — `LOC` field capitalisation:** in Part I (servers), the `LOC` field is always **lowercase** (`es-m`, `pt-11`). In Part II (user endpoints), it is **uppercase** (`ES-M`, `PT-11`). This difference is intentional and allows visual distinction between both inventories. All automation pipelines must apply the correct case transformation depending on the asset type. See Annex C for validation regular expressions.
 
### 3.2 FQDN Pattern

```
<hostname>.<env>.<loc>.<provider>.<dominio_corporativo>
```

**Corporate domain:**

| Domain | Use | Management |
|---------|-----|---------|
| `yoruverse.com` | Public zone and internet-facing services | Cloudflare |
| `yoruverse.local` | Active Directory internal zone (transitional use) | Internal DC DNS |

> ⚠️ **Transition note:** using `.local` as an AD domain suffix is not recommended by current best practices (conflicts with mDNS/Bonjour, incompatibility with some cloud services). The goal is to migrate all internal records to `yoruverse.com` managed with split-horizon DNS (see section 7.2). Until the migration is complete, `yoruverse.local` remains a valid internal domain and must be accounted for in all validation tooling.

**Example (public zone / yoruverse.com):**

```
es-m-onp-prd-dir-001.prd.es-m.onp.yoruverse.com
```

**Example (internal zone / yoruverse.local — transitional use):**

```
es-m-dmg-prd-fsr-001.prd.es-m.dmg.yoruverse.local
```
 
---
 
## 4. Standardised Codes
 
### 4.1 Geographic Location (`LOC`) — Full ISO 3166-2 in lowercase
 
The full ISO 3166-2 code (including the country prefix) is used in lowercase. For generic cloud regions (without a specific geographic subdivision), abbreviated region codes are used.
 
**Current sites with server infrastructure:**
 
| LOC Code | Location | Official ISO 3166-2 code |
|------------|-----------|--------------------------|
| `es-m` | Madrid, Spain | ES-M |
| `es-b` | Barcelona, Spain | ES-B |
| `pt-11` | Lisbon, Portugal | PT-11 |
| `fr-75` | Paris, France | FR-75 |
 
**Generic cloud regions:**
 
| Code | Description | Physical country |
|--------|-------------|-----------------|
| `euw1` | Europe West 1 (eu-west-1) | Ireland (Dublin) |
| `euw3` | Europe West 3 (eu-west-3) | France |
| `eus2` | Europe South 2 (eu-south-2) | Spain |
| `euc1` | Europe Central 1 (eu-central-1) | Germany |
| `use1` | US East 1 (us-east-1) | Eastern USA |
| `usw2` | US West 2 (us-west-2) | Western USA |
 
> When a generic cloud region code is used as `LOC`, the `<COUNTRY>` field of the AD short name is determined by the physical datacenter country (see section 2.3.1).
 
### 4.2 Platform / Provider (`PLT`)
 
| Code | Provider / Platform |
|--------|------------------------|
| `onp` | On-Premise (own datacentre) — includes physical servers and VMs when the hypervisor is not operationally relevant |
| `dmg` | DMG Cloud |
| `aws` | Amazon Web Services |
| `azr` | Microsoft Azure |
| `gcp` | Google Cloud Platform |
| `vmw` | VMware vSphere — use exclusively for VMware hypervisor hosts (ROL: `hvs`) |
| `kvm` | KVM / Proxmox — use exclusively for KVM/Proxmox hypervisor hosts (ROL: `hvs`) |

> **Usage rule `onp` vs `vmw`/`kvm`:** use `onp` for all on-premise servers (physical and VMs). Reserve `vmw` and `kvm` exclusively for hypervisor hosts (ROL `hvs`), where identifying the virtualisation platform has direct operational relevance. VMs running on those hypervisors continue using `onp`.
 
### 4.3 Environment (`ENV`)
 
| Code | Description |
|--------|-------------|
| `prd` | Production |
| `pre` | Pre-production |
| `tst` | Testing / QA |
| `dev` | Development |
| `lab` | Lab / PoC |
 
### 4.4 Functional Role (`ROL`)
 
#### Applications and Backend
 
| Code | Description |
|--------|-------------|
| `app` | General application server |
| `api` | Backend API / Microservices |
| `web` | Web server (frontend) |
| `job` | Job / batch server |
| `mq` | Messaging server (RabbitMQ, Kafka) |
 
#### Databases
 
| Code | Description |
|--------|-------------|
| `dbs` | Database server |
| `dbc` | Database cluster |
| `rds` | DB read replica |
 
#### Infrastructure
 
| Code | Description |
|--------|-------------|
| `dir` | Directory (Active Directory, LDAP) |
| `dns` | DNS server |
| `dhcp` | DHCP server |
| `vpn` | VPN Gateway (software) |
| `prx` | Proxy / Reverse Proxy |
| `fwl` | Application firewall (software) |
 
#### Management and Monitoring
 
| Code | Description |
|--------|-------------|
| `mon` | Monitoring (Prometheus, Zabbix) |
| `log` | Centralised logging (ELK, Graylog) |
| `cfg` | Configuration / Orchestration (Ansible, Puppet) |
| `bkp` | Backup server |
 
#### Storage and Files
 
| Code | Description |
|--------|-------------|
| `fsr` | File Server (SMB / NFS) |
| `nas` | NAS / Storage Appliance |
| `s3g` | Object Storage Gateway |
 
#### Virtualisation and Containers
 
| Code | Description |
|--------|-------------|
| `hvs` | Hypervisor Server |
| `kmn` | Kubernetes Master / Control Plane |
| `kwn` | Kubernetes Worker Node |
| `dkr` | Docker Host |
 
#### Network and Security
 
| Code | Description |
|--------|-------------|
| `rtr` | L3 Router |
| `swt` | L2/L3 Switch |
| `fwh` | Hardware Firewall |
| `vpnh` | Hardware VPN Gateway |
| `lbh` | Hardware Load Balancer |
| `pdu` | PDU (Power Distribution Unit) |
| `ups` | UPS |
 
### 4.5 Numeric Sequence (`NNN`)
 
- Format: `001`, `002`, `003`… `999` (always 3 digits, zero-padded).
- **Valid range: `001`–`999`. The value `000` is explicitly excluded** and must not be assigned under any circumstance.
- Numbering per logical group (role + location + environment).
- Do not reuse numbers within the same group after decommissioning.
- Reserve ranges based on estimated need (e.g., `001–099` for primary nodes, `101–199` for replicas).

> ⚠️ **Operational note — single-character LOC after the hyphen:** some ISO 3166-2 codes produce single-character segments in the `LOC` field (e.g., `es-m` → Madrid, `es-b` → Barcelona, `es-a` → Alicante). Visually, the separator hyphen and the subdivision character may be confused with a plain hyphen. When building or validating hostnames with these codes, pay special attention to ensuring the LOC is `es-m` and not `es` or `m` independently. Validation pipelines must explicitly cover this case (see Annex C).
 
---
 
## 5. Standard Application by Server Type
 
### 5.1 Application Servers
 
```
es-m-dmg-prd-app-001.prd.es-m.dmg.yoruverse.com
es-m-dmg-prd-app-002.prd.es-m.dmg.yoruverse.com
eus2-aws-dev-api-001.dev.eus2.aws.yoruverse.com
```
 
### 5.2 Database Servers
 
**Physical nodes:**
 
```
es-m-onp-prd-dbs-001.prd.es-m.onp.yoruverse.com
es-m-onp-prd-dbs-002.prd.es-m.onp.yoruverse.com
```
 
**Functional aliases (CNAMEs):**
 
```
prd-db-writer.prd.es-m.onp.yoruverse.com → es-m-onp-prd-dbs-001
prd-db-reader.prd.es-m.onp.yoruverse.com → es-m-onp-prd-dbs-002
```
 
### 5.3 Web and Load-Balanced Servers
 
```
es-m-dmg-prd-web-001.prd.es-m.dmg.yoruverse.com
es-m-dmg-prd-web-002.prd.es-m.dmg.yoruverse.com
www.yoruverse.com → prd-web-vip.prd.es-m.dmg.yoruverse.com   (CNAME/VIP)
```
 
### 5.4 Infrastructure (AD, DNS, Monitoring)
 
```
es-m-onp-prd-dir-001.prd.es-m.onp.yoruverse.com
es-m-onp-prd-dns-001.prd.es-m.onp.yoruverse.com
es-m-dmg-prd-mon-001.prd.es-m.dmg.yoruverse.com
es-m-dmg-prd-bkp-001.prd.es-m.dmg.yoruverse.com
```
 
### 5.5 Hypervisors
 
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
 
### 5.7 Network Equipment
 
Network equipment follows the same general pattern: `<LOC>-<PLT>-<ENV>-<ROL>-<NNN>`. A network device may be on-premise or in the cloud (e.g., a virtual router in AWS).
 
```
es-m-onp-prd-rtr-001.prd.es-m.onp.yoruverse.com
es-m-onp-prd-swt-001.prd.es-m.onp.yoruverse.com
es-m-onp-prd-fwh-001.prd.es-m.onp.yoruverse.com
euw1-aws-prd-rtr-001.prd.euw1.aws.yoruverse.com
```
 
---
 
## 6. Lifecycle Policies
 
### 6.1 Server Provisioning

> **Note:** the internal Active Directory domain is `yoruverse.local`. Internal FQDNs use `yoruverse.local` instead of `yoruverse.com`. The public zone `yoruverse.com` is managed in Cloudflare for internet-facing services.
 
1. **Mandatory automation:** use scripts/IaC (Terraform, Ansible) that build the name according to this standard.
2. **Uniqueness validation:** verify the full hostname does not already exist in CMDB.
3. **AD short name generation:** generate `YRU-<COUNTRY>SV-<ID>`, verifying no collisions exist in AD.
4. **CMDB registration** with status `active`, IP, OS, provider, owner, BU, cost centre, and project. Also register the AD short name.
5. **DNS:** create A/AAAA records in the appropriate zone based on the server's domain:
   - Servers with FQDN in `yoruverse.com` → create record in Cloudflare.
   - Servers with FQDN in `yoruverse.local` (internal zone, transitional use) → create record in the internal DC DNS (Windows DNS). Do not create `yoruverse.local` records in Cloudflare.
6. **AD join:** rename the machine using the short name before joining the domain. Store the full FQDN in the `description` attribute (e.g., `es-m-dmg-prd-app-001.prd.es-m.dmg.yoruverse.com`).
 
### 6.2 Geographic Location Change (mandatory rename)
 
If a server changes geographic location (different ISO 3166-2 code in `LOC`), it must be renamed to reflect the new location.
 
1. Schedule a maintenance window.
2. Build the new hostname with the updated `LOC`.
3. Verify uniqueness of the new name in CMDB.
4. Migrate DNS records (create new A record; keep the old one as a temporary CNAME for 30 days).
5. Rename the server in the OS. The AD short name does not change unless the country changes.
6. Update hostname in CMDB, keeping the previous name as historical reference.
7. Update the `description` attribute in the AD object with the new full FQDN.
8. Update references in dependent systems (monitoring, backup, CMDB).
9. Verify correct operation. Remove the old CNAME after the grace period.
 
> **Note:** if the location change involves a country change, a new AD short name is generated with the ISO 3166-2 prefix of the new country.
 
### 6.3 Role Change or Provider Migration
 
- **Permanent role change:** create a new server with the correct name, migrate services, decommission the old one.
- **Provider migration:** create a new hostname with the updated `PLT`; use functional CNAMEs for a transparent transition.
 
### 6.4 Decommissioning and Recycling
 
1. Mark in CMDB: status changes to `decommissioned` with date and reason.
2. Retain history: keep hostname–IP–service association for audit purposes.
3. No reuse: the hostname is permanently retired.
4. DNS: remove records after the grace period (30–90 days per policy).
5. Exceptions: reuse requires Architecture Committee approval and explicit documentation.
 
---
 
## 7. DNS Management in Cloudflare
 
### 7.1 Zone Structure
 
**Root zone:** `yoruverse.com`
 
**Delegated subzones by provider and environment:**
 
```
prd.es-m.dmg.yoruverse.com       (Producción DMG Cloud Madrid)
dev.es-m.dmg.yoruverse.com       (Desarrollo DMG Cloud Madrid)
prd.eus2.aws.yoruverse.com       (Producción AWS EU South — Madrid)
prd.es-m.onp.yoruverse.com       (Producción On-Premise Madrid)
```

**Internal DNS subzones (`yoruverse.local`) created in the DC:**

```
dmg.yoruverse.local              (DMG Cloud — DNS interno)
es-m.dmg.yoruverse.local         (DMG Cloud Madrid — DNS interno)
prd.es-m.dmg.yoruverse.local     (Producción DMG Cloud Madrid — DNS interno)
```
 
### 7.2 Split-Horizon DNS
 
1. Configure Resolver Policies in Cloudflare Zero Trust › Gateway: if the **FQDN** belongs to the subdomains `*.dmg.yoruverse.com` or `*.onp.yoruverse.com`, resolve via private DNS.
2. For Enterprise: use DNS › Internal DNS with private views.
3. Result: internal hostnames not publicly visible; direct resolution with private IPs.
 
---
 
## 8. Best Practices — Servers
 
### 8.1 What to Avoid in the Hostname
 
❌ Business Unit (BU) → goes in CMDB/cloud tags.  
❌ Software versions (`sql2022`, `win2019`).  
❌ Temporary project names.  
❌ Specific hardware information (model, cores).  
❌ Creative or character names.  
❌ Inventing codes not documented in the standard.  
❌ Renaming for minor changes (AZ change, physical host migration within the same location).  
❌ Reusing decommissioned hostnames.  
 
### 8.2 What to Do
 
✅ Use CNAMEs for functional names that may move between nodes.  
✅ Document exceptions explicitly with Architecture approval.  
✅ Validate names automatically in CI/CD pipelines.  
✅ Keep CMDB up to date as the source of truth.  
✅ Register the AD short name alongside the DNS hostname in CMDB.  
✅ Use `yoruverse.local` for internal AD server DNS records until the migration to `yoruverse.com` with split-horizon is complete (see sections 3.2 and 7.2).  
✅ Register the domain in use (`yoruverse.com` or `yoruverse.local`) in CMDB to facilitate migration planning.  
 
---
 
## 9. Complete Examples — Servers
 
### Example 1: Production Application Server (Madrid, DMG Cloud)
 
| Field | Value |
|-------|-------|
| DNS Hostname | `es-m-dmg-prd-app-001` |
| FQDN | `es-m-dmg-prd-app-001.prd.es-m.dmg.yoruverse.com` |
| AD Short Name | `YRU-ESSV-A1B2C` |
| sAMAccountName | `YRU-ESSV-A1B2C$` |
| AD Description | `es-m-dmg-prd-app-001.prd.es-m.dmg.yoruverse.com` |
| Private IP | `10.20.30.40` |
| OS | Windows Server 2022 |
| BU (in CMDB) | A3/ERP |
| Cloud tags | `BU=a3erp, Environment=production, ManagedBy=terraform` |
 
### Example 2: PostgreSQL Development Database (Madrid, On-Premise)
 
| Field | Value |
|-------|-------|
| DNS Hostname | `es-m-onp-dev-dbs-001` |
| FQDN | `es-m-onp-dev-dbs-001.dev.es-m.onp.yoruverse.com` |
| AD Short Name | `YRU-ESSV-D4E5F` |
| sAMAccountName | `YRU-ESSV-D4E5F$` |
| AD Description | `es-m-onp-dev-dbs-001.dev.es-m.onp.yoruverse.com` |
| Private IP | `172.16.10.50` |
| OS | Ubuntu 22.04 LTS |
| BU (in CMDB) | Corporativo / IT Interno |
 
### Example 3: Kubernetes Worker AWS EU South (physical datacentre in Spain)
 
| Field | Value |
|-------|-------|
| DNS Hostname | `eus2-aws-prd-kwn-005` |
| FQDN | `eus2-aws-prd-kwn-005.prd.eus2.aws.yoruverse.com` |
| AD Short Name | `YRU-ESSV-G7H8I` |
| sAMAccountName | `YRU-ESSV-G7H8I$` |
| AD Description | `eus2-aws-prd-kwn-005.prd.eus2.aws.yoruverse.com` |
| Private IP | `10.100.5.20` |
| OS | Amazon Linux 2 |
| BU (in CMDB) | Finanzas |
| AWS tags | `BU=finanzas, Environment=production, K8sCluster=prod-01` |
 
### Example 4: On-Premise Router (Madrid)

| Field | Value |
|-------|-------|
| DNS Hostname | `es-m-onp-prd-rtr-001` |
| FQDN | `es-m-onp-prd-rtr-001.prd.es-m.onp.yoruverse.com` |
| Management IP | `192.168.1.1` |
| Manufacturer | Cisco |
| BU (in CMDB) | Infraestructura / Shared Services |

> **Note:** network equipment with roles `rtr`, `swt`, `fwh`, `vpnh`, `lbh`, `pdu`, and `ups` does not join the Active Directory domain and therefore does not require an AD short name or `sAMAccountName`. Management is handled via local credentials or dedicated network management systems (NMS).

### Example 5: Production File Server (Madrid, DMG Cloud)

| Field | Value |
|-------|-------|
| DNS Hostname | `es-m-dmg-prd-fsr-001` |
| FQDN | `es-m-dmg-prd-fsr-001.prd.es-m.dmg.yoruverse.local` |
| AD Short Name | `YRU-ESSV-K2M9P` |
| sAMAccountName | `YRU-ESSV-K2M9P$` |
| AD Description | `es-m-dmg-prd-fsr-001.prd.es-m.dmg.yoruverse.local` |
| Private IP | `172.30.0.20` |
| OS | Windows Server |
| BU (in CMDB) | Infraestructura / IT Interno |
 
---
 
# PART II — User Endpoint Naming
 
Applies to all user endpoints (laptops, desktops, tablets, corporate phones, etc.). Servers are covered in Part I.
 
---
 
## 10. Base Naming Pattern
 
```
YRU-<LOC>-<NNN>
```
 
| Field | Description |
|-------|-------------|
| `YRU` | Yoruverse corporate prefix (the group company). |
| `<LOC>` | Full ISO 3166-2 code in uppercase corresponding to the **home site** of the employee to whom the device is assigned (e.g., `ES-M` for Madrid, `ES-LE` for León, `PT-11` for Lisbon). |
| `<NNN>` | Sequential 3-digit numeric counter, global per site (LOC). Range `001–999`. |
 
> **Home site vs. physical location:** `LOC` reflects the organisational site the employee belongs to, not where the device is at any given moment. A remote worker retains their home site code. The actual physical location is recorded in CMDB and in the AD `location` attribute when relevant for support or logistics.
 
**Ejemplos:**
 
```
YRU-ES-M-001    (Device assigned to an employee at the Madrid site)
YRU-ES-LE-001   (Device assigned to an employee at the León site)
YRU-ES-B-001    (Device assigned to an employee at the Barcelona site)
YRU-PT-11-001   (Device assigned to an employee at the Lisbon site)
```
 
> The `LOC` code is the same ISO 3166-2 standard as in servers, in uppercase. This allows direct cross-referencing of CMDB data between both inventories.

> ⚠️ **Warning — Capitalisation difference between Part I and Part II:** the `LOC` field is written in **lowercase** in server hostnames (`es-m`, `pt-11`) and in **uppercase** in user endpoint names (`ES-M`, `PT-11`). This difference is intentional and helps visually distinguish both inventories, but can cause errors if names are built manually or in scripts that mix both conventions. All automation pipelines must apply the correct case transformation based on asset type. See Annex C for validation regular expressions.
 
---
 
## 11. Field Codes — User Endpoints
 
### 11.1 `LOC` Field (Full ISO 3166-2 in uppercase)
 
**Current Yoruverse sites:**
 
| LOC Code | Province / City |
|------------|--------------------|
| `ES-LE` | León |
| `ES-AV` | Ávila |
| `ES-M` | Madrid |
| `ES-O` | Asturias (Gijón) |
| `ES-B` | Barcelona |
| `ES-A` | Alicante |
 
**International expansion (examples):**
 
| LOC Code | City |
|------------|-----------|
| `PT-11` | Lisbon, Portugal |
| `FR-75` | Paris, France |
| `DE-BE` | Berlin, Germany |
| `IT-RM` | Rome, Italy |
| `GB-LND` | London, United Kingdom |
 
### 11.2 `NNN` Field (Sequential counter)
 
- Format: `001` to `999`, always 3 digits, zero-padded.
- **Valid range: `001`–`999`. The value `000` is explicitly excluded** and must not be assigned under any circumstance. Inventory systems and validation pipelines must reject any name containing `-000` as a suffix.
- The counter is global per site (`LOC`): all devices at the same site share the same numeric series, regardless of device type.
- Maintain a centralised record of the last NNN assigned per site.
- Do not reuse numbers from decommissioned devices.
 
### 11.3 Device Type (in CMDB and AD)
 
The device type is not part of the device name. It is recorded as an attribute in CMDB and Active Directory:
 
| Type | Recommended value in CMDB / AD |
|------|-------------------------------|
| Laptop | `LP` |
| Desktop | `DT` |
| Workstation (high performance) | `WK` |
| Tablet | `TB` |
| Corporate phone (mobile) | `PH` |
| All-in-One | `AIO` |
| Other (special cases) | `OT` |
 
---
 
## 12. Active Directory Compatibility — User Endpoints
 
The new pattern `YRU-<LOC>-<NNN>` produces names that fit within the 15-character `sAMAccountName` limit in most cases, eliminating the truncation problem that existed with the previous pattern.
 
| Device name | Length | Fits in 15 chars? |
|------------------|----------|---------------------|
| `YRU-ES-M-001` | 13 chars | ✅ No truncation |
| `YRU-ES-LE-001` | 14 chars | ✅ No truncation |
| `YRU-ES-AV-001` | 14 chars | ✅ No truncation |
| `YRU-PT-11-001` | 14 chars | ✅ No truncation |
| `YRU-GB-LND-001` | 15 chars | ✅ No truncation (exact limit) |
 
The device name is used directly as `cn` and `sAMAccountName` in AD without the need for an additional short name.
 
---
 
## 13. Multi-site and Location Changes
 
### 13.1 General Rule
 
- `LOC` represents the employee's **home site**, not their physical location at any given moment.
- A remote or temporarily displaced worker **does not trigger a rename** of the device.
- If the employee permanently changes home site (e.g., definitive transfer to another office), the device **is renamed** to reflect the new site.
- The actual physical location (home, client office, etc.) is recorded in the AD `location` attribute and in CMDB, but does not affect the device name.
 
### 13.2 Rename Process for Home Site Change
 
1. Confirm that the employee's transfer is permanent and approved by HR/IT.
2. Determine the new `LOC` and check the next available `NNN` for that site.
3. Rename the device in the operating system.
4. Execute the rename in AD (ADUC console or PowerShell).
5. Update the AD `location` attribute with the new site.
6. Update the central inventory: new site, change date, and previous name for traceability.
7. Verify authentication and that management tools (EDR, RMM) recognise the change.
 
**Example:** employee from León permanently transferred to Ávila. Their laptop `YRU-ES-LE-015` is renamed to `YRU-ES-AV-004` (assuming the last device registered in Ávila was 003).
 
---
 
## 14. Active Directory Implementation — User Endpoints
 
### 14.1 Recommended AD Attributes
 
| AD Attribute | Content |
|-------------|-----------|
| `description` | Full device name, assigned user, model, manufacturer serial number. |
| `extensionAttribute1` | Device type (`LP`, `DT`, `WK`, `TB`, `PH`, `AIO`, `OT`). |
| `location` / `physicalDeliveryOfficeName` | Current physical location: site, building, floor, room, or "Remote – home". |
| `extensionAttribute2–15` | Custom data: cost centre, project, etc. |
 
---
 
## 15. Complete Examples — User Endpoints
 
| Name | Type (in CMDB/AD) | Home site |
|--------|-------------------|---------------------|
| `YRU-ES-LE-001` | LP | León |
| `YRU-ES-LE-002` | DT | León |
| `YRU-ES-AV-001` | DT | Ávila |
| `YRU-ES-M-001` | LP | Madrid |
| `YRU-ES-M-002` | WK | Madrid |
| `YRU-ES-O-001` | LP | Gijón (Asturias) |
| `YRU-ES-B-001` | LP | Barcelona |
| `YRU-ES-B-002` | AIO | Barcelona |
| `YRU-ES-A-001` | TB | Alicante |
| `YRU-PT-11-001` | LP | Lisbon (Portugal) |
| `YRU-FR-75-001` | LP | Paris (France) |
 
---
 
## 16. Special Cases and Exceptions
 
- **Labs and test environments:** prefix `YRU-<LOC>-TST-<NNN>` (e.g., `YRU-ES-M-TST-001`) followed by a free identifier, documented in inventory. The `<LOC>` field follows the same uppercase ISO 3166-2 format as the rest of Part II.
- **Temporary devices (loans, demos):** prefix `YRU-<LOC>-TMP-<NNN>` (e.g., `YRU-ES-LE-TMP-001`) until definitively assigned to an employee and site. The `<LOC>` field indicates the origin site or storage location.
- **Special-purpose devices:** document the exception in inventory with justification and date.
- Any exception must be documented with the reason and IT manager approval.

> **Note:** exception names `TST` and `TMP` do not pass the standard regex C.4 (which validates the pattern `YRU-<LOC>-<NNN>`). They must be validated with a dedicated exception pattern and explicitly registered in CMDB with the field `name_type = exception`.
 
---
 
# PART III — Governance
 
---
 
## 17. Migration Policy — Pre-Standard Servers

This section governs the handling of servers that existed before this standard was published (version 1.1, March 2026) and therefore have non-compliant names.

### 17.1 Pre-Standard Server Classification

Upon publication of this standard, all existing servers must be inventoried in CMDB with the `naming_compliance` field set to one of the following values:

| Value | Description |
|-------|-------------|
| `compliant` | The name meets the standard in all fields. |
| `non_compliant` | The name does not meet the standard (free-form name, incorrect format, non-random AD short name, etc.). |
| `exempt` | The server has been declared exempt by the Naming Committee with documented justification. |

### 17.2 Progressive Migration Plan

`non_compliant` servers must be migrated to the new standard within a maximum of **6 months** from this standard's publication date (deadline: **September 17, 2026**), in the following priority order:

| Priority | Criterion | Deadline |
|-----------|----------|--------------|
| 1 — High | Production servers (`prd`) with free-form or unintelligible names | 2 months (17/05/2026) |
| 2 — Medium | Production servers with partially compliant names (e.g., non-random AD ID) | 4 months (17/07/2026) |
| 3 — Low | Non-production environment servers (`pre`, `tst`, `dev`, `lab`) | 6 months (17/09/2026) |

**During the migration period**, the following must be recorded in CMDB for each `non_compliant` server:
- `current_name`: the name currently in use.
- `target_name`: the standard-compliant name it will have after migration.
- `planned_migration_date`: estimated rename date.
- `owner`: team or person responsible for executing the rename.

### 17.3 Pre-Standard Server Rename Process

The rename follows the same procedure as section 6.2 (Geographic Location Change), with these particularities:

1. Calculate the new standard-compliant hostname from the server's current attributes (LOC, PLT, ENV, ROL).
2. If the AD short name is also non-compliant (e.g., non-random ID), generate a new one per section 2.3.1 and record the old short name in CMDB as `previous_ad_short_name`.
3. Keep the old name as a DNS CNAME for a minimum of 30 days to avoid breaking dependent services.
4. Update the `description` attribute in AD with the new full FQDN.
5. Update CMDB: `naming_compliance = compliant`, record previous name and migration date.

### 17.4 Exemptions

Servers that cannot be migrated within the established timeframe (e.g., due to critical application dependencies, contractual support restrictions, or servers nearing imminent decommissioning) may be declared exempt by the Naming Committee. Every exemption must:
- Be documented in CMDB with reason, review date, and proposed alternative.
- Be reviewed at each quarterly audit cycle.
- Have an expiry date: if the server remains active after expiry, the exemption is re-evaluated.

---

## 18. Code Management and Governance
 
### 18.1 Master Code Document
 
- **Location:** corporate Git repository + IT Wiki (https://wiki.yoruverse.com/naming-standard).
- **Content:** up-to-date list of all approved codes (`LOC`, `PLT`, `ENV`, `ROL`), BU → cloud tag mapping table, examples by device type, procedure for requesting new codes, and change history.
 
### 18.2 Naming Committee
 
**Responsible:** Architecture / IT Platform team.
 
**Responsibilities:**
- Approve new codes and abbreviations.
- Review periodically (quarterly) to retire obsolete codes.
- Resolve conflicts or special cases.
- Update documentation and communicate changes to all affected teams.
 
**New code approval process:**
 
1. Request via ticket (Jira / ServiceNow).
2. Technical validation: no conflicts with existing codes, convention followed.
3. Approval at committee meeting.
4. Publication in master document and Wiki.
5. Communication to affected teams.
 
### 18.3 Audits and Compliance Control
 
- Quarterly/semi-annual compliance audits.
- Periodic reports on devices with non-compliant names.
- Mandatory training for new IT team members on naming standard usage.
- Document the rename process in an SOP (Standard Operating Procedure).
- Physically label user endpoints with the full name for visual identification.
 
---
 
## Annex A: Normative References
 
- RFC 1034 – Domain Names: Concepts and Facilities.
- RFC 1123 – Requirements for Internet Hosts.
- ISO 3166-2 – Codes for the representation of names of countries and their subdivisions.
- Microsoft Documentation – Active Directory sAMAccountName Attribute.
- Cloudflare DNS Documentation.
- Yoruverse internal CMDB documentation.
 
---
 
## Annex B: Spanish Provinces Table (ISO 3166-2:ES)
 
Full code reference for the `LOC` field for Spain-based sites:
 
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

## Annex C: Validation Regular Expressions

This annex provides formal regex patterns for validating names defined in this standard. They are designed for direct use in CI/CD pipelines (Terraform, Ansible), provisioning scripts, and CMDB audit tooling.

> **Convention:** all patterns are expressed as full anchors (`^...$`) to avoid partial matches. Examples are shown in syntax compatible with Python (`re`), JavaScript (`RegExp`), and POSIX ERE tools.

---

### C.1 Server Hostname (Part I)

**Pattern:** `<LOC>-<PLT>-<ENV>-<ROL>-<NNN>`

```
^(es-m|es-b|pt-11|fr-75|euw1|euw3|eus2|euc1|use1|usw2)-(onp|dmg|aws|azr|gcp|vmw|kvm)-(prd|pre|tst|dev|lab)-(app|api|web|job|mq|dbs|dbc|rds|dir|dns|dhcp|vpn|prx|fwl|mon|log|cfg|bkp|fsr|nas|s3g|hvs|kmn|kwn|dkr|rtr|swt|fwh|vpnh|lbh|pdu|ups)-([0-9]{3})$
```

**Additional restrictions enforced by this regex:**

| Restriction | Enforcement |
|-------------|------------|
| Lowercase and hyphens only | All segments lowercase; `[0-9]{3}` for NNN |
| `NNN` exactly 3 digits | `[0-9]{3}` — rejects `1`, `01`, `0001` |
| `NNN` != `000` | Validate programmatically: `int(nnn) >= 1` after capturing the group |
| Total length <= 63 chars | Validate programmatically after match |

**Python usage example:**

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

**JavaScript usage example:**

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

### C.2 Server FQDN (Part I)

**Pattern:** `<hostname>.<env>.<loc>.<provider>.<corporate_domain>`

> **Two domains in use (transitional state):** during the migration period from `yoruverse.local` to `yoruverse.com`, validators must accept both suffixes. The long-term target domain is `yoruverse.com` with split-horizon DNS (see section 3.2).

**Public zone pattern (`yoruverse.com`):**

```
^[a-z][a-z0-9-]{0,61}[a-z0-9]\.(prd|pre|tst|dev|lab)\.(es-m|es-b|pt-11|fr-75|euw1|euw3|eus2|euc1|use1|usw2)\.(onp|dmg|aws|azr|gcp|vmw|kvm)\.yoruverse\.net$
```

**Internal zone pattern (`yoruverse.local` — transitional use):**

```
^[a-z][a-z0-9-]{0,61}[a-z0-9]\.(prd|pre|tst|dev|lab)\.(es-m|es-b|pt-11|fr-75|euw1|euw3|eus2|euc1|use1|usw2)\.(onp|dmg|aws|azr|gcp|vmw|kvm)\.yoruverse\.local$
```

**Notes:**

- The hostname segment (`[a-z][a-z0-9-]{0,61}[a-z0-9]`) follows RFC 1034: starts with a letter, ends with a letter or digit, maximum 63 chars.
- To validate consistency between the ENV in the hostname and the ENV in the subzone, it is recommended to split the FQDN by `.` and compare fields individually (see C.1).
- Total FQDN length must not exceed 255 characters (programmatic validation).

**Python example:**

```python
import re

FQDN_NET_RE = re.compile(
    r'^[a-z][a-z0-9-]{0,61}[a-z0-9]'
    r'\.(prd|pre|tst|dev|lab)'
    r'\.(es-m|es-b|pt-11|fr-75|euw1|euw3|eus2|euc1|use1|usw2)'
    r'\.(onp|dmg|aws|azr|gcp|vmw|kvm)'
    r'\.yoruverse\.net$'
)

# Transitional: valid while servers exist in yoruverse.local
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
    return bool(FQDN_NET_RE.match(fqdn) or FQDN_LOCAL_RE.match(fqdn))
```

---

### C.3 AD Short Name — Servers (Part I)

**Pattern:** `YRU-<COUNTRY2>SV-<ID5>`

```
^YRU-([A-Z]{2})SV-([A-Z0-9]{5})$
```

**Additional restrictions:**

| Restriction | Enforcement |
|-------------|------------|
| Total length <= 15 chars | `YRU-` (4) + 2 + `SV-` (3) + 5 = 14 chars for 2-char countries — always within limit |
| `<COUNTRY>` in approved list | Validate against: `ES`, `PT`, `FR`, `DE`, `GB`, `IT`, `IE`, `US` |
| `<ID>` unique in AD | Programmatic verification against AD before assigning |

**Python example:**

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

### C.4 User Endpoint (Part II)

**Pattern:** `YRU-<LOC_UPPERCASE>-<NNN>`

The `<LOC>` field accepts ISO 3166-2 codes for approved sites. Due to its variability, it is recommended to validate LOC against the master table rather than hardcoding it in the regex. The base pattern validates the structure:

```
^YRU-([A-Z]{2,3}-[A-Z0-9]{1,3})-([0-9]{3})$
```

> This pattern covers the general ISO 3166-2 form (`XX-YY` or `XX-YYY`). For strict validation, complement with the approved sites list.

**Additional restrictions:**

| Restriction | Enforcement |
|-------------|------------|
| `NNN` != `000` | `int(nnn) >= 1` after capturing the group |
| Total length <= 15 chars | Validate `len(name) <= 15` |
| `LOC` in approved sites list | Verify against `LOC` master table |

**Python example:**

```python
import re

USER_DEVICE_RE = re.compile(r'^YRU-([A-Z]{2,3}-[A-Z0-9]{1,3})-([0-9]{3})$')

APPROVED_LOC = {
    'ES-LE', 'ES-AV', 'ES-M', 'ES-O', 'ES-B', 'ES-A',
    'PT-11', 'FR-75', 'DE-BE', 'IT-RM', 'GB-LND',
    # Add new sites here after Naming Committee approval
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

### C.5 Pattern Summary

> Full patterns with all enumerated values are in sections C.1–C.4. This table is a quick reference index only.

| Scope | Pattern (schematic — see indicated section) | Additional validations |
|--------|---------------------------------------------|--------------------------|
| Server hostname | `^(LOC)-(PLT)-(ENV)-(ROL)-([0-9]{3})$` — see **C.1** | `NNN >= 001`; length <= 63 |
| Server FQDN (`yoruverse.com`) | `^hostname.(ENV).(LOC).(PLT).yoruverse.com$` — see **C.2** | Length <= 255; ENV consistency hostname vs subzone |
| Server FQDN (`yoruverse.local`, transitional) | `^hostname.(ENV).(LOC).(PLT).yoruverse.local$` — see **C.2** | Length <= 255; ENV consistency hostname vs subzone |
| Server AD short name | `^YRU-([A-Z]{2})SV-([A-Z0-9]{5})$` — see **C.3** | Country in approved list; ID unique in AD; length <= 15 |
| User endpoint | `^YRU-([A-Z]{2,3}-[A-Z0-9]{1,3})-([0-9]{3})$` — see **C.4** | `NNN >= 001`; LOC in approved list; length <= 15 |

> **Maintenance:** when new `LOC`, `PLT`, `ENV`, or `ROL` codes are added to the standard, simultaneously update the patterns in this Annex C and the master code document (section 18.1). The Naming Committee is responsible for keeping both in sync.
<!-- ---

## Annex D: Change History

| Version | Date | Author | Description |
|---------|-------|-------|-------------|
| 1.0 | 01/03/2026 | juan.cuellar@yoruverse.com | Initial internal version (working draft, not distributed). |
| 1.1 | 12/03/2026 | juan.cuellar@yoruverse.com | First published and distributed version. Full standard structure: Part I (servers), Part II (user endpoints), and Part III (governance). |
| 1.2 | 17/03/2026 | juan.cuellar@yoruverse.com | Server `es-m-dmg-prd-fsr-001` added. Internal DNS subzones created: `dmg.yoruverse.local`, `es-m.dmg.yoruverse.local`, `prd.es-m.dmg.yoruverse.local`. Clarification of internal domain `yoruverse.local` vs public domain `yoruverse.com`. |
| 1.3 | 17/03/2026 | juan.cuellar@yoruverse.com | Pre-production quality review: LOC length corrected (4–6 chars); ROL extended to 2–4 chars to cover `mq`; `yoruverse.local` formalised in FQDN pattern (section 3.2) and regex C.2 with transition note; `onp`/`vmw`/`kvm` usage criterion clarified in section 4.2; `euw1` region corrected (Ireland only); Example 5 corrected (random AD short name and `description` field); server provisioning step 5 differentiated by domain; section 7.2 corrected (FQDN, not hostname); section 16 migrated to full LOC; note on network equipment without AD; improvements to section 8.2 and Annex C.5; version 1.0 added to history. |
| 1.4 | 17/03/2026 | juan.cuellar@yoruverse.com | Review based on real AD object (server `YRU-ESSV-FSR01`): `description` attribute changed from hostname to full FQDN throughout the documentation (sections 2.3, 2.3.1, 6.1, 6.2 and all section 9 examples); `dNSHostName` attribute documented with comparative table in section 2.3.1; new section 17 (Pre-Standard Server Migration Policy) with classification, progressive migration deadlines, rename process and exemption policy; former section 17 renumbered to section 18. | -->