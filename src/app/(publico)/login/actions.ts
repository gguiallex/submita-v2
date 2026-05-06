'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function realizarLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const senha = formData.get('senha') as string;

  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario || senha !== 'admin123') {
    throw new Error('Credenciais inválidas.');
  }

  const cookieStore = await cookies();

  cookieStore.set('submita_session', usuario.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  cookieStore.set('submita_role', usuario.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  if (usuario.role === 'REVISOR') {
    redirect('/revisor');
  }

  redirect('/admin/edicoes');
}