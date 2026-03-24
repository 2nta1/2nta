import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCompanyProfile() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  try {
    const company = await prisma.company.findUnique({
      where: { email: session.user.email },
      select: {
        specialty: true,
        name: true,
        image: true,
        phone: true,
        googleMapsLink: true,
        industry: true,
        foundingYear: true,
        description: true,
        clients: true,
        country: true,
        region: true,
        city: true,
        address: true,
      },
    });

    return company || null;
  } catch (error) {
    console.error('Error fetching company profile:', error);
    return null;
  }
}

export async function updateCompanyProfile(profile: {
  specialty: string | null;
  name: string;
  image: string | null;
  phone: string;
  googleMapsLink: string | null;
  industry: string;
  foundingYear: number | null;
  description: string;
  clients: string;
  country: string;
  region: string;
  city: string;
  address: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  try {
    const updatedCompany = await prisma.company.upsert({
      where: { email: session.user.email },
      update: profile,
      create: {
        email: session.user.email,
        ...profile,
      },
    });

    return updatedCompany;
  } catch (error) {
    console.error('Error updating company profile:', error);
    return null;
  }
}
