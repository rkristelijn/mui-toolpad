import NextAuth from 'next-auth';
import Github from 'next-auth/providers/github';
import Keycloak from 'next-auth/providers/keycloak';
import type { Provider } from 'next-auth/providers';


const providers: Provider[] = [
  Github({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }),

  Keycloak({
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
		issuer: process.env.KEYCLOAK_ISSUER,
  }),
];

if(!process.env.GITHUB_CLIENT_ID) { 
  console.warn('Missing environment variable "GITHUB_CLIENT_ID"');
}
if(!process.env.GITHUB_CLIENT_SECRET) {
  console.warn('Missing environment variable "GITHUB_CLIENT_SECRET"');
}
if(!process.env.KEYCLOAK_CLIENT_ID) { 
  console.warn('Missing environment variable "KEYCLOAK_CLIENT_ID"');
}
if(!process.env.KEYCLOAK_CLIENT_SECRET) {
  console.warn('Missing environment variable "KEYCLOAK_CLIENT_SECRET"');
}
if(!process.env.KEYCLOAK_ISSUER) {
  console.warn('Missing environment variable "KEYCLOAK_ISSUER"');
}


export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider();
      return { id: providerData.id, name: providerData.name };
  }
  return { id: provider.id, name: provider.name };
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  
  
      
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isPublicPage = nextUrl.pathname.startsWith('/public');

      if (isPublicPage || isLoggedIn) {
        return true;
      }

      return false; // Redirect unauthenticated users to login page
    },
  },
});
  