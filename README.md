# Omikuji

## Deploy

Install AWS SAM and setup your AWS profile.

Replace `<your-user-id>` and `<your-password>`.
Hit enter for the first deploy (make sure the region is `ap-northeast-1`).

```bash
USER_ID=<your-user-id> PASSWORD=<your-password> ./deploy.sh
```

## Local testing

Replace `<your-user-id>` and `<your-password>`.
If your machine is not a Mac, change local Chrome path to yours.

```bash
USER_ID=<your-user-id> PASSWORD=<your-password> npm run test
```
