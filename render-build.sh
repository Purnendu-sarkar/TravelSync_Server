set -o errexit

npm install
npx prisma generate
npx prisma migrate deploy
