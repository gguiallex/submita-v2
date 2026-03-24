import { PrismaClient } from '@prisma/client';

// Função que cria um novo cliente do Prisma.
const prismaClientSingleton = () => {
    return new PrismaClient();
}

// Declara que o objeto 'global' do Node.js pode ter uma propriedade chamada 'prisma'.
declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Tenta usar a conexão já salva. Caso não existir, cria uma nova usando a função.
const prisma = globalThis.prisma ?? prismaClientSingleton();

// Exporta a conexão para que possa ser usada em qualquer página do site.
export default prisma;

// Se não estiver em modo de produção, salva a conexão atual no objeto global
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;