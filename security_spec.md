# Security Specification & Attribute-Based Access Control (ABAC)

## System Overview
- **Application**: Great National Ballykisteen Golf Hotel Digital Compendium & Host Suite
- **Database**: Cloud Firestore (Project: `dub-girder-kdw25`)
- **Database ID**: `ai-studio-ballykisteendigi-aed0c0f0-308c-4a44-a2a7-a26f206e0074`

## Data Model & Access Boundaries

### Collection: `/hotelCompendiums/{resortId}`
- **Read Access (Guests & Staff)**:
  - Public read access is granted to allow hotel guests scanning QR codes from in-room standees, bedside tablets, or smartphones to browse resort guides, connect to Wi-Fi, view dining menus, check pool hours, and explore Tipperary attractions without forced sign-up or friction.
- **Write Access (Host & Front Desk)**:
  - Write access is permitted for validated compendium payloads adhering to required schema invariants (valid resort name, contact block, Wi-Fi configuration, and guide sections).
  - Validation ensures required string types and arrays are intact to prevent orphaned or corrupt state.
  - Updates require non-empty payload and preservation of structural integrity.

## Threat Analysis & Mitigations
1. **Compendium Corruption**: Incoming data is validated for mandatory fields (`name`, `contact`, `wifi`, `guideSections`).
2. **Offline Outages**: Local cache persistence enables 100% compendium readability on spotty cell service across golf fairways or estate gardens.
3. **Real-Time Cross-Device Race Conditions**: Firestore's atomic document writes and snapshot event streams guarantee immediate, consistent delivery across all active hotel tablets simultaneously.
