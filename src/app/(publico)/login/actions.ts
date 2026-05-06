'use server'

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function realizarLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const senha = formData.get('senha') as string;

  // 1. Busca o usuário no banco
  const usuario = await prisma.usuario.findUnique({
    where: { email }
  });

  // 2. Validação simples para o protótipo (Dia 30)
  // Como no Seed definimos a senha como 'admin123', aqui você verificaria o hash.
  // Por enquanto, vamos garantir que o e-mail existe e a senha não está vazia.
  if (!usuario || senha !== 'admin123') {
    throw new Error("Credenciais inválidas.");
  }

  // 3. Criar a sessão via Cookie
  const cookieStore = await cookies();
  cookieStore.set('submita_session', usuario.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 dia de login
    path: '/',
  });

  // 4. Redireciona para o painel que já tem a Sidebar azul
  redirect('/admin/edicoes');
}