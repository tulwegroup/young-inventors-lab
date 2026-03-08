import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      childProfileId?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    childProfileId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
    childProfileId?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Parent Login with Email/Password
    CredentialsProvider({
      id: 'parent-credentials',
      name: 'Parent Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'parent@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || user.role !== 'parent') {
          return null;
        }

        // For demo: Default parent password is "inventor2024"
        const validPassword = credentials.password === 'inventor2024';

        if (!validPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
        };
      },
    }),

    // Child Login with Simple Code
    CredentialsProvider({
      id: 'child-credentials',
      name: 'Child Login',
      credentials: {
        code: { label: 'Your Secret Code', type: 'text', placeholder: 'Enter your code' },
      },
      async authorize(credentials) {
        if (!credentials?.code) {
          return null;
        }

        // Child login codes mapped to emails
        const childCodes: Record<string, string> = {
          'MESHA2024': 'mesha@inventorslab.com',
          'MUSICHE2024': 'musiche@inventorslab.com',
        };

        const email = childCodes[credentials.code.toUpperCase()];
        if (!email) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || user.role !== 'child') {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
          childProfileId: user.childProfile?.id,
        };
      },
    }),
  ],

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.childProfileId = user.childProfileId;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.childProfileId = token.childProfileId;
      }
      return session;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
