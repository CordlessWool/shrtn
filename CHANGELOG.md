# shrtn.to

## 2.1.2

### Patch Changes

- c46fa43: add run migration to deploy script

## 2.1.1

### Patch Changes

- 10ec493: add feature flag for build and deploy in pipelines
- 5ad2dbb: fix ttl dropdown - remove forever on select and set infinity on remove

## 2.1.0

### Minor Changes

- 81a72c7: Add marketing pages and feature switch
- 4bb68db: Add call limit und passphrase to protect and limit link access
- 8360584: Add Spanish translation

## 2.0.4

### Patch Changes

- fad9097: fix permissions of database on docker mounted folder

## 2.0.3

### Patch Changes

- a431d63: remove build for arm7

## 2.0.2

### Patch Changes

- d9c9f27: add test to testing container and fix container build issues

## 2.0.1

### Patch Changes

- 4876de7: switch docker container from node to bun

## 2.0.0

### Major Changes

- f45860c: - !Important: local sqlite files must now start with file: in env name.
  - Replace better-sqlite3 with libSQL to support remove databases and async use
  - Add cloudflare worker support

### Minor Changes

- ae6ec6e: fix mailsending and add d1 support

### Patch Changes

- 5ec1592: fix select dropdown background color in windows by set a fix color for select

## 1.7.2

### Patch Changes

- open terms and imrpint in new tab

## 1.7.1

### Patch Changes

- update dependencies

## 1.7.0

### Minor Changes

- Add possbility to add term of use and imprint

## 1.6.4

### Patch Changes

- add a descrtipin for link input

## 1.6.3

### Patch Changes

- e27c0ee: improve typing and styling

## 1.6.2

### Patch Changes

- - add link to source code on github
  - update dependencies including tailwindcss 4.0
  - load origin env only once by loading it in a server defaults

## 1.6.1

### Patch Changes

- add favicon icons

## 1.6.0

### Minor Changes

- 37d5681: use ORIGIN instead of PUBLIC_BASE_URL

## 1.5.0

### Minor Changes

- bce8508: add arm versions to build

## 1.4.1

### Patch Changes

- improve link loading and fix returned link

## 1.4.0

### Minor Changes

- 988ee53: translate emails en, de

## 1.3.4

### Patch Changes

- bf76241: generate new nanoid if unique constrain failed
- bf76241: fix load of links with no expire date

## 1.3.3

### Patch Changes

- a951564: fix language switch

## 1.3.2

### Patch Changes

- fix zip add also drizzle meta

## 1.3.1

### Patch Changes

- fix zip file and add all migrations

## 1.3.0

### Minor Changes

- improve accessibilty and seo
- 807a7cb: Sending key to mail instead of link
- b142a99: add i18n

### Patch Changes

- be3439c: fix missing run and await

## 1.2.0

### Minor Changes

- 948ce12: move from bun to nodejs
- ad155c7: improve form validation and feedback

### Patch Changes

- 948ce12: imrpove validateion to avoid crashes
- 19ab63d: use nodejs for dockerfile instead of bun

## 1.1.1

### Patch Changes

- add dynamic_origin

## 1.1.0

### Minor Changes

- dbe314d: - update dependencies
  - remove unsused dependencies
  - remove lucia demo code

### Patch Changes

- add migration to builds

## 1.0.0

### Major Changes

- MVP of Link shortener shrtn.io
