# O'zGezer Data Model Specification

## Core Entities

### regions

- one record for each of Uzbekistan's 14 administrative regions
- referenced by places

### categories

- top-level place grouping for travel use cases
- initial categories:
  - historical
  - nature
  - recreation
  - food
  - markets

### users

- supports authenticated users and role-based permissions
- roles:
  - `VISITOR`
  - `REGISTERED`
  - `CONTRIBUTOR`
  - `ADMIN`

### places

Required product fields:

- `slug`
- `regionId`
- `status`
- `published`
- `nameUz`
- `nameRu`
- `nameEn`
- `descriptionUz`
- `descriptionRu`
- `descriptionEn`
- `latitude`
- `longitude`

Operational fields:

- `price`
- `workingHours`
- `phone`
- `website`
- `viewCount`
- `averageRating`
- `reviewCount`

### reviews

- one review per `userId + placeId`
- includes:
  - `rating`
  - `comment`
  - `wouldRecommend`
  - `status`
  - optional photo

### photos

- gallery photos attached to a place
- sortable display order
- uploader traceability

### saved_places

- join entity for user saved content
- stores list type for future "want to go" vs "visited" segmentation

### contributor_requests

- tracks contributor applications and admin decisions

### place_drafts

- proposed places submitted by contributors before publication

## Enums

- `UserRole`: `REGISTERED`, `CONTRIBUTOR`, `ADMIN`
- `ReviewStatus`: `PENDING`, `APPROVED`, `REJECTED`
- `PlaceStatus`: `DRAFT`, `PUBLISHED`, `ARCHIVED`
- `ContributorStatus`: `PENDING`, `APPROVED`, `REJECTED`
- `SavedPlaceType`: `WANT_TO_GO`, `VISITED`

`VISITOR` is a product-level state for unauthenticated users, not a database role.

## Rules Locked Before Phase 1

- Only `ADMIN` and approved `CONTRIBUTOR` users can create place records for moderation or publication flows
- Public places must expose Uzbek, Russian, and English name and description fields
- A user may only leave one review per place
- Review moderation remains available to admins
- Contributor-submitted places are stored separately from directly published admin places
