## Getting Started

Clone this repository (for contributing, fork this repository first, then clone) using this command:  

```bash
git clone https://github.com/javeria2108/docs-clone
```

then install all the dependencies using: 
```bash
npm install
```
create a .env.local file in the root of your project and paste your secret keys here 

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[your clerk key]
CLERK_SECRET_KEY=[your clerk secret]

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_OUT_URL=/sign-out

LIVEBLOCKS_SECRET_KEY=[your liveblocks key]

SENTRY_AUTH_TOKEN=[your sentry token]
```

finally run the app using this command: 
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


