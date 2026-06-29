import { PrismaClient, Role, ProjectStatus, ProjectLane, MilestoneStatus, ApplicationStatus } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
dotenv.config()

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('🌱 Seeding database with demo data...')

  // ------------------------------------------------------------------
  // USERS
  // ------------------------------------------------------------------
  const hashPwd = (p: string) => bcrypt.hashSync(p, 10)

  // NGO users
  const ngoUser1 = await prisma.user.upsert({
    where: { email: 'greenearth@ngo.org' },
    update: {},
    create: {
      name: 'Priya Sharma',
      email: 'greenearth@ngo.org',
      password: hashPwd('demo1234'),
      role: Role.NGO,
      walletAddress: '0xA1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0',
    },
  })

  const ngoUser2 = await prisma.user.upsert({
    where: { email: 'saathicare@ngo.org' },
    update: {},
    create: {
      name: 'Rahul Desai',
      email: 'saathicare@ngo.org',
      password: hashPwd('demo1234'),
      role: Role.NGO,
      walletAddress: '0xB2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1',
    },
  })

  // Company users
  const compUser1 = await prisma.user.upsert({
    where: { email: 'csr@techcorp.in' },
    update: {},
    create: {
      name: 'Anita Menon',
      email: 'csr@techcorp.in',
      password: hashPwd('demo1234'),
      role: Role.COMPANY,
      walletAddress: '0xC3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2',
    },
  })

  const compUser2 = await prisma.user.upsert({
    where: { email: 'csr@infrabuilders.in' },
    update: {},
    create: {
      name: 'Vikram Nair',
      email: 'csr@infrabuilders.in',
      password: hashPwd('demo1234'),
      role: Role.COMPANY,
      walletAddress: '0xD4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3',
    },
  })

  // Volunteer users
  const volUser1 = await prisma.user.upsert({
    where: { email: 'arjun.volunteer@gmail.com' },
    update: {},
    create: {
      name: 'Arjun Patil',
      email: 'arjun.volunteer@gmail.com',
      password: hashPwd('demo1234'),
      role: Role.VOLUNTEER,
    },
  })

  const volUser2 = await prisma.user.upsert({
    where: { email: 'sneha.vol@gmail.com' },
    update: {},
    create: {
      name: 'Sneha Kulkarni',
      email: 'sneha.vol@gmail.com',
      password: hashPwd('demo1234'),
      role: Role.VOLUNTEER,
    },
  })

  const volUser3 = await prisma.user.upsert({
    where: { email: 'karan.helps@gmail.com' },
    update: {},
    create: {
      name: 'Karan Mehta',
      email: 'karan.helps@gmail.com',
      password: hashPwd('demo1234'),
      role: Role.VOLUNTEER,
    },
  })

  console.log('✅ Users created')

  // ------------------------------------------------------------------
  // NGO PROFILES
  // ------------------------------------------------------------------
  const ngo1 = await prisma.nGOProfile.upsert({
    where: { userId: ngoUser1.id },
    update: {},
    create: {
      userId: ngoUser1.id,
      organization: 'Green Earth Foundation',
      registrationNo: 'NGO-MH-2018-00421',
      walletAddress: '0xA1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0',
      phone: '+91-9823401234',
      address: '12, Baner Road, Pune, Maharashtra 411045',
      focusAreas: ['Environment', 'Education', 'Rural Development'],
      description:
        'Green Earth Foundation works towards environmental sustainability and rural education. We have impacted over 15,000 beneficiaries across Maharashtra since 2018.',
    },
  })

  const ngo2 = await prisma.nGOProfile.upsert({
    where: { userId: ngoUser2.id },
    update: {},
    create: {
      userId: ngoUser2.id,
      organization: 'Saathi Care NGO',
      registrationNo: 'NGO-KA-2020-00789',
      walletAddress: '0xB2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1',
      phone: '+91-9901234567',
      address: '45, Koramangala 5th Block, Bengaluru, Karnataka 560095',
      focusAreas: ['Healthcare', 'Livelihood', 'Women Empowerment'],
      description:
        'Saathi Care provides healthcare access and livelihood support to underserved communities in Karnataka. Operating since 2020 with 8,000+ direct beneficiaries.',
    },
  })

  console.log('✅ NGO profiles created')

  // ------------------------------------------------------------------
  // COMPANY PROFILES
  // ------------------------------------------------------------------
  const comp1 = await prisma.companyProfile.upsert({
    where: { userId: compUser1.id },
    update: {},
    create: {
      userId: compUser1.id,
      companyName: 'TechCorp India Pvt. Ltd.',
      csrRegNo: 'CIN-U72200MH2010PTC201234',
      totalBudget: 5000000,
      walletAddress: '0xC3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2',
      industry: 'Information Technology',
      phone: '+91-2040123456',
      address: 'Hinjewadi Phase 1, Pune, Maharashtra 411057',
    },
  })

  const comp2 = await prisma.companyProfile.upsert({
    where: { userId: compUser2.id },
    update: {},
    create: {
      userId: compUser2.id,
      companyName: 'InfraBuilders Ltd.',
      csrRegNo: 'CIN-L45200KA2005PLC034567',
      totalBudget: 8000000,
      walletAddress: '0xD4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3',
      industry: 'Infrastructure & Construction',
      phone: '+91-8023456789',
      address: 'MG Road, Bengaluru, Karnataka 560001',
    },
  })

  console.log('✅ Company profiles created')

  // ------------------------------------------------------------------
  // VOLUNTEER PROFILES
  // ------------------------------------------------------------------
  const vol1 = await prisma.volunteerProfile.upsert({
    where: { userId: volUser1.id },
    update: {},
    create: {
      userId: volUser1.id,
      skills: ['Teaching', 'Community Outreach', 'Data Entry'],
      totalHours: 48,
      location: 'Pune, Maharashtra',
      availability: 'Weekends',
    },
  })

  const vol2 = await prisma.volunteerProfile.upsert({
    where: { userId: volUser2.id },
    update: {},
    create: {
      userId: volUser2.id,
      skills: ['Healthcare', 'First Aid', 'Counselling'],
      totalHours: 32,
      location: 'Bengaluru, Karnataka',
      availability: 'Weekends & Holidays',
    },
  })

  const vol3 = await prisma.volunteerProfile.upsert({
    where: { userId: volUser3.id },
    update: {},
    create: {
      userId: volUser3.id,
      skills: ['Construction', 'Plumbing', 'Electrical'],
      totalHours: 24,
      location: 'Pune, Maharashtra',
      availability: 'Full-time (June–August)',
    },
  })

  console.log('✅ Volunteer profiles created')

  // ------------------------------------------------------------------
  // PROJECTS
  // ------------------------------------------------------------------
  const project1 = await prisma.project.upsert({
    where: { proposalRef: 'PRP-2024-001' },
    update: {},
    create: {
      proposalRef: 'PRP-2024-001',
      title: 'Digital Literacy for Rural Schools – Phase 2',
      description:
        'Establishing computer labs and digital literacy programs in 10 government schools across Pune district. The project will provide tablets, Wi-Fi connectivity, and trained teachers to 2,000 children in grades 6–10.',
      sector: 'Education',
      location: 'Pune District, Maharashtra',
      budget: 1500000,
      beneficiaries: 2000,
      progress: 65,
      status: ProjectStatus.ACTIVE,
      lane: ProjectLane.IN_PROGRESS,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-11-30'),
      escrowTxHash: '0xabc123def456789012345678901234567890abcdef1234567890abcdef123456',
      escrowBalance: 1500000,
      ngoId: ngo1.id,
      submittedAt: new Date('2024-02-15'),
    },
  })

  const project2 = await prisma.project.upsert({
    where: { proposalRef: 'PRP-2024-002' },
    update: {},
    create: {
      proposalRef: 'PRP-2024-002',
      title: 'Clean Water Access – Village Borewell Programme',
      description:
        'Installing 15 borewells and water purification systems in 5 drought-prone villages of Marathwada region. Clean water access for 3,500 residents, reducing waterborne diseases by an estimated 60%.',
      sector: 'Rural Development',
      location: 'Aurangabad, Maharashtra',
      budget: 2200000,
      beneficiaries: 3500,
      progress: 100,
      status: ProjectStatus.COMPLETED,
      lane: ProjectLane.COMPLETED,
      startDate: new Date('2024-01-10'),
      endDate: new Date('2024-06-30'),
      escrowTxHash: '0xdef456abc789012345678901234567890abcdef1234567890abcdef1234567890',
      escrowBalance: 0,
      ngoId: ngo1.id,
      submittedAt: new Date('2023-12-20'),
    },
  })

  const project3 = await prisma.project.upsert({
    where: { proposalRef: 'PRP-2024-003' },
    update: {},
    create: {
      proposalRef: 'PRP-2024-003',
      title: 'Mobile Health Clinic – Tribal Belt Karnataka',
      description:
        'Deploying 3 mobile health clinics to provide primary healthcare, vaccinations, and maternal care to 12 tribal villages in Mysuru district with no medical facilities within 50 km.',
      sector: 'Healthcare',
      location: 'Mysuru District, Karnataka',
      budget: 1800000,
      beneficiaries: 5200,
      progress: 40,
      status: ProjectStatus.ACTIVE,
      lane: ProjectLane.IN_PROGRESS,
      startDate: new Date('2024-05-01'),
      endDate: new Date('2025-04-30'),
      escrowTxHash: '0x789012abcdef3456789012345678901234567890abcdef1234567890abcdef12',
      escrowBalance: 1800000,
      ngoId: ngo2.id,
      submittedAt: new Date('2024-04-10'),
    },
  })

  const project4 = await prisma.project.upsert({
    where: { proposalRef: 'PRP-2024-004' },
    update: {},
    create: {
      proposalRef: 'PRP-2024-004',
      title: 'Women Skill Development – Textile & Handicraft',
      description:
        'Six-month vocational training program for 200 women from below-poverty-line families in tailoring, embroidery, and handicraft. Includes raw material support and market linkage for self-employment.',
      sector: 'Livelihood',
      location: 'Bengaluru Rural, Karnataka',
      budget: 950000,
      beneficiaries: 200,
      progress: 0,
      status: ProjectStatus.UNDER_REVIEW,
      lane: ProjectLane.PLANNING,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-03-31'),
      escrowTxHash: '',
      escrowBalance: 0,
      ngoId: ngo2.id,
      submittedAt: new Date('2024-07-01'),
    },
  })

  console.log('✅ Projects created')

  // ------------------------------------------------------------------
  // MILESTONES – Project 1 (Digital Literacy)
  // ------------------------------------------------------------------
  const ms1 = await prisma.milestone.upsert({
    where: { milestoneRef: 'M-001' },
    update: {},
    create: {
      milestoneRef: 'M-001',
      projectId: project1.id,
      title: 'Infrastructure Setup – 5 Schools',
      description: 'Procurement and installation of computers, projectors, and Wi-Fi routers in the first 5 schools.',
      amount: 500000,
      deadline: new Date('2024-04-30'),
      status: MilestoneStatus.APPROVED,
      proofDesc: 'All 5 schools equipped. 126 computers installed, 15 projectors, 5 routers. Principal sign-off obtained. Photos attached.',
      proofIpfsHash: 'QmXyz1234abcdef5678901234567890abcdef1234567890ab',
      proofPhotoHash: 'QmPhoto1234abcdef5678901234567890abcdef',
      geoLocation: '18.5204,73.8567',
      approvalTx: '0x111aaa222bbb333ccc444ddd555eee666fff777aaa888bbb999ccc000ddd111',
      submittedAt: new Date('2024-04-28'),
    },
  })

  const ms2 = await prisma.milestone.upsert({
    where: { milestoneRef: 'M-002' },
    update: {},
    create: {
      milestoneRef: 'M-002',
      projectId: project1.id,
      title: 'Teacher Training – 50 Government Teachers',
      description: 'Three-day digital literacy training workshop for 50 government school teachers.',
      amount: 300000,
      deadline: new Date('2024-06-30'),
      status: MilestoneStatus.APPROVED,
      proofDesc: '52 teachers trained over 3 days at Pune University training center. Attendance sheet & certificates attached.',
      proofIpfsHash: 'QmXyz5678cdef1234abcd5678901234567890abcdef1234',
      proofPhotoHash: 'QmPhoto5678cdef1234abcd567890',
      geoLocation: '18.5204,73.8567',
      approvalTx: '0x222bbb333ccc444ddd555eee666fff777aaa888bbb999ccc000ddd111eee222',
      submittedAt: new Date('2024-06-25'),
    },
  })

  const ms3 = await prisma.milestone.upsert({
    where: { milestoneRef: 'M-003' },
    update: {},
    create: {
      milestoneRef: 'M-003',
      projectId: project1.id,
      title: 'Infrastructure Setup – Remaining 5 Schools',
      description: 'Installation of equipment in schools 6–10 and internet connectivity for all 10 schools.',
      amount: 400000,
      deadline: new Date('2024-08-31'),
      status: MilestoneStatus.SUBMITTED,
      proofDesc: 'Schools 6–10 equipped. ISP connectivity live across all 10 schools. Network test reports enclosed.',
      proofIpfsHash: 'QmXyz9012ghij3456klmn9012345678901234567890abcd',
      geoLocation: '18.5204,73.8567',
      submittedAt: new Date('2024-08-29'),
    },
  })

  const ms4 = await prisma.milestone.upsert({
    where: { milestoneRef: 'M-004' },
    update: {},
    create: {
      milestoneRef: 'M-004',
      projectId: project1.id,
      title: 'Student Enrollment & Assessment',
      description: 'Enroll 2,000 students, conduct baseline digital literacy assessment.',
      amount: 300000,
      deadline: new Date('2024-10-31'),
      status: MilestoneStatus.PENDING,
    },
  })

  // Milestones – Project 2 (Borewell, COMPLETED)
  const ms5 = await prisma.milestone.upsert({
    where: { milestoneRef: 'M-005' },
    update: {},
    create: {
      milestoneRef: 'M-005',
      projectId: project2.id,
      title: 'Survey & Site Selection – 5 Villages',
      description: 'Geo-survey and government NOC for borewell locations in 5 villages.',
      amount: 200000,
      deadline: new Date('2024-02-15'),
      status: MilestoneStatus.APPROVED,
      proofDesc: 'Survey completed by certified hydrogeologist. NOCs obtained from Zilla Parishad.',
      proofIpfsHash: 'QmSurvey1234abcdef',
      approvalTx: '0x333ccc444ddd555eee666fff777aaa888bbb999ccc000ddd111eee222fff333',
      submittedAt: new Date('2024-02-12'),
    },
  })

  const ms6 = await prisma.milestone.upsert({
    where: { milestoneRef: 'M-006' },
    update: {},
    create: {
      milestoneRef: 'M-006',
      projectId: project2.id,
      title: 'Borewell Drilling – All 15 Units',
      description: 'Drilling of 15 borewells to 200ft depth with submersible pumps.',
      amount: 1100000,
      deadline: new Date('2024-05-15'),
      status: MilestoneStatus.APPROVED,
      proofDesc: 'All 15 borewells drilled and operational. Water quality test passed. Photos & lab reports attached.',
      proofIpfsHash: 'QmDrill5678cdef1234',
      approvalTx: '0x444ddd555eee666fff777aaa888bbb999ccc000ddd111eee222fff333aaa444',
      submittedAt: new Date('2024-05-10'),
    },
  })

  const ms7 = await prisma.milestone.upsert({
    where: { milestoneRef: 'M-007' },
    update: {},
    create: {
      milestoneRef: 'M-007',
      projectId: project2.id,
      title: 'Water Purification Systems & Community Training',
      description: 'Install RO purification units and train village water committees.',
      amount: 900000,
      deadline: new Date('2024-06-30'),
      status: MilestoneStatus.APPROVED,
      proofDesc: '15 RO units installed. Village water committees formed (75 members trained). Final impact report submitted.',
      proofIpfsHash: 'QmPurify9012ghij3456',
      approvalTx: '0x555eee666fff777aaa888bbb999ccc000ddd111eee222fff333aaa444bbb555',
      submittedAt: new Date('2024-06-28'),
    },
  })

  // Milestones – Project 3 (Mobile Health Clinic)
  const ms8 = await prisma.milestone.upsert({
    where: { milestoneRef: 'M-008' },
    update: {},
    create: {
      milestoneRef: 'M-008',
      projectId: project3.id,
      title: 'Vehicle Procurement & Medical Equipment',
      description: 'Purchase 3 ambulance-style vans and equip with basic medical diagnostic equipment.',
      amount: 700000,
      deadline: new Date('2024-06-30'),
      status: MilestoneStatus.APPROVED,
      proofDesc: '3 vehicles purchased (RC copies enclosed). Equipment (BP monitors, ECG, ultrasound) installed and tested.',
      proofIpfsHash: 'QmVehicle2345bcde',
      approvalTx: '0x666fff777aaa888bbb999ccc000ddd111eee222fff333aaa444bbb555ccc666',
      submittedAt: new Date('2024-06-25'),
    },
  })

  const ms9 = await prisma.milestone.upsert({
    where: { milestoneRef: 'M-009' },
    update: {},
    create: {
      milestoneRef: 'M-009',
      projectId: project3.id,
      title: 'Q3 Camp Operations – 6 Villages',
      description: '12 health camps conducted across 6 villages (July–September 2024).',
      amount: 550000,
      deadline: new Date('2024-09-30'),
      status: MilestoneStatus.SUBMITTED,
      proofDesc: '14 health camps completed. 1,840 patients seen. Vaccination (polio, tetanus) administered to 312 children. Detailed camp registers attached.',
      proofIpfsHash: 'QmCamp6789efgh',
      submittedAt: new Date('2024-09-28'),
    },
  })

  console.log('✅ Milestones created')

  // ------------------------------------------------------------------
  // FUND RELEASES
  // ------------------------------------------------------------------
  await prisma.fundRelease.upsert({
    where: { milestoneId: ms1.id },
    update: {},
    create: {
      milestoneId: ms1.id,
      releaseTxHash: '0xfund111aaa222bbb333ccc444ddd555eee666fff777aaa888bbb999ccc000',
      releasedAt: new Date('2024-05-02'),
    },
  })

  await prisma.fundRelease.upsert({
    where: { milestoneId: ms2.id },
    update: {},
    create: {
      milestoneId: ms2.id,
      releaseTxHash: '0xfund222bbb333ccc444ddd555eee666fff777aaa888bbb999ccc000ddd111',
      releasedAt: new Date('2024-07-01'),
    },
  })

  await prisma.fundRelease.upsert({
    where: { milestoneId: ms5.id },
    update: {},
    create: {
      milestoneId: ms5.id,
      releaseTxHash: '0xfund333ccc444ddd555eee666fff777aaa888bbb999ccc000ddd111eee222',
      releasedAt: new Date('2024-02-16'),
    },
  })

  await prisma.fundRelease.upsert({
    where: { milestoneId: ms6.id },
    update: {},
    create: {
      milestoneId: ms6.id,
      releaseTxHash: '0xfund444ddd555eee666fff777aaa888bbb999ccc000ddd111eee222fff333',
      releasedAt: new Date('2024-05-13'),
    },
  })

  await prisma.fundRelease.upsert({
    where: { milestoneId: ms7.id },
    update: {},
    create: {
      milestoneId: ms7.id,
      releaseTxHash: '0xfund555eee666fff777aaa888bbb999ccc000ddd111eee222fff333aaa444',
      releasedAt: new Date('2024-07-02'),
    },
  })

  await prisma.fundRelease.upsert({
    where: { milestoneId: ms8.id },
    update: {},
    create: {
      milestoneId: ms8.id,
      releaseTxHash: '0xfund666fff777aaa888bbb999ccc000ddd111eee222fff333aaa444bbb555',
      releasedAt: new Date('2024-06-28'),
    },
  })

  console.log('✅ Fund releases created')

  // ------------------------------------------------------------------
  // CSR ALLOCATIONS
  // ------------------------------------------------------------------
  await prisma.cSRAllocation.upsert({
    where: { id: 'alloc-001' },
    update: {},
    create: {
      id: 'alloc-001',
      companyId: comp1.id,
      projectId: project1.id,
      amount: 1500000,
      escrowTxHash: '0xescrow111aaa222bbb333ccc444ddd555eee666fff777aaa888bbb999ccc000',
      status: 'ACTIVE',
      allocatedAt: new Date('2024-02-28'),
    },
  })

  await prisma.cSRAllocation.upsert({
    where: { id: 'alloc-002' },
    update: {},
    create: {
      id: 'alloc-002',
      companyId: comp2.id,
      projectId: project2.id,
      amount: 2200000,
      escrowTxHash: '0xescrow222bbb333ccc444ddd555eee666fff777aaa888bbb999ccc000ddd111',
      status: 'RELEASED',
      allocatedAt: new Date('2024-01-15'),
    },
  })

  await prisma.cSRAllocation.upsert({
    where: { id: 'alloc-003' },
    update: {},
    create: {
      id: 'alloc-003',
      companyId: comp1.id,
      projectId: project3.id,
      amount: 900000,
      escrowTxHash: '0xescrow333ccc444ddd555eee666fff777aaa888bbb999ccc000ddd111eee222',
      status: 'ACTIVE',
      allocatedAt: new Date('2024-04-25'),
    },
  })

  await prisma.cSRAllocation.upsert({
    where: { id: 'alloc-004' },
    update: {},
    create: {
      id: 'alloc-004',
      companyId: comp2.id,
      projectId: project3.id,
      amount: 900000,
      escrowTxHash: '0xescrow444ddd555eee666fff777aaa888bbb999ccc000ddd111eee222fff333',
      status: 'ACTIVE',
      allocatedAt: new Date('2024-04-26'),
    },
  })

  console.log('✅ CSR allocations created')

  // ------------------------------------------------------------------
  // VOLUNTEER APPLICATIONS
  // ------------------------------------------------------------------
  const app1 = await prisma.volunteerApplication.upsert({
    where: { id: 'vappl-001' },
    update: {},
    create: {
      id: 'vappl-001',
      volunteerId: vol1.id,
      projectId: project1.id,
      status: ApplicationStatus.ACCEPTED,
      appliedAt: new Date('2024-03-05'),
    },
  })

  const app2 = await prisma.volunteerApplication.upsert({
    where: { id: 'vappl-002' },
    update: {},
    create: {
      id: 'vappl-002',
      volunteerId: vol2.id,
      projectId: project3.id,
      status: ApplicationStatus.ACCEPTED,
      appliedAt: new Date('2024-05-05'),
    },
  })

  await prisma.volunteerApplication.upsert({
    where: { id: 'vappl-003' },
    update: {},
    create: {
      id: 'vappl-003',
      volunteerId: vol3.id,
      projectId: project2.id,
      status: ApplicationStatus.ACCEPTED,
      appliedAt: new Date('2024-01-15'),
    },
  })

  await prisma.volunteerApplication.upsert({
    where: { id: 'vappl-004' },
    update: {},
    create: {
      id: 'vappl-004',
      volunteerId: vol1.id,
      projectId: project3.id,
      status: ApplicationStatus.APPLIED,
      appliedAt: new Date('2024-07-01'),
    },
  })

  console.log('✅ Volunteer applications created')

  // ------------------------------------------------------------------
  // ATTENDANCE RECORDS
  // ------------------------------------------------------------------
  const attendances = [
    {
      id: 'att-001', volunteerId: vol1.id, projectId: project1.id,
      checkInTime: new Date('2024-04-06T09:00:00Z'), checkOutTime: new Date('2024-04-06T17:00:00Z'),
      hours: 8, geoHash: 'tft5g2k3', blockchainTx: '0xattn111aaa222bbb333ccc',
    },
    {
      id: 'att-002', volunteerId: vol1.id, projectId: project1.id,
      checkInTime: new Date('2024-04-13T09:00:00Z'), checkOutTime: new Date('2024-04-13T17:00:00Z'),
      hours: 8, geoHash: 'tft5g2k3', blockchainTx: '0xattn222bbb333ccc444ddd',
    },
    {
      id: 'att-003', volunteerId: vol1.id, projectId: project1.id,
      checkInTime: new Date('2024-05-04T09:00:00Z'), checkOutTime: new Date('2024-05-04T16:00:00Z'),
      hours: 7, geoHash: 'tft5g2k3', blockchainTx: '0xattn333ccc444ddd555eee',
    },
    {
      id: 'att-004', volunteerId: vol1.id, projectId: project1.id,
      checkInTime: new Date('2024-06-01T09:30:00Z'), checkOutTime: new Date('2024-06-01T17:30:00Z'),
      hours: 8, geoHash: 'tft5g2k3', blockchainTx: '0xattn444ddd555eee666fff',
    },
    {
      id: 'att-005', volunteerId: vol1.id, projectId: project1.id,
      checkInTime: new Date('2024-07-06T09:00:00Z'), checkOutTime: new Date('2024-07-06T14:00:00Z'),
      hours: 5, geoHash: 'tft5g2k3', blockchainTx: '0xattn555eee666fff777aaa',
    },
    {
      id: 'att-006', volunteerId: vol2.id, projectId: project3.id,
      checkInTime: new Date('2024-06-08T08:00:00Z'), checkOutTime: new Date('2024-06-08T16:00:00Z'),
      hours: 8, geoHash: 'tf0gp2j4', blockchainTx: '0xattn666fff777aaa888bbb',
    },
    {
      id: 'att-007', volunteerId: vol2.id, projectId: project3.id,
      checkInTime: new Date('2024-07-13T08:00:00Z'), checkOutTime: new Date('2024-07-13T16:00:00Z'),
      hours: 8, geoHash: 'tf0gp2j4', blockchainTx: '0xattn777aaa888bbb999ccc',
    },
    {
      id: 'att-008', volunteerId: vol2.id, projectId: project3.id,
      checkInTime: new Date('2024-08-10T08:00:00Z'), checkOutTime: new Date('2024-08-10T14:00:00Z'),
      hours: 6, geoHash: 'tf0gp2j4', blockchainTx: '0xattn888bbb999ccc000ddd',
    },
    {
      id: 'att-009', volunteerId: vol3.id, projectId: project2.id,
      checkInTime: new Date('2024-02-03T08:00:00Z'), checkOutTime: new Date('2024-02-03T18:00:00Z'),
      hours: 10, geoHash: 'tflhzg1p', blockchainTx: '0xattn999ccc000ddd111eee',
    },
    {
      id: 'att-010', volunteerId: vol3.id, projectId: project2.id,
      checkInTime: new Date('2024-03-02T08:00:00Z'), checkOutTime: new Date('2024-03-02T16:00:00Z'),
      hours: 8, geoHash: 'tflhzg1p', blockchainTx: '0xattn000ddd111eee222fff',
    },
  ]

  for (const att of attendances) {
    await prisma.attendance.upsert({ where: { id: att.id }, update: {}, create: att })
  }

  // Update total hours
  await prisma.volunteerProfile.update({ where: { id: vol1.id }, data: { totalHours: 36 } })
  await prisma.volunteerProfile.update({ where: { id: vol2.id }, data: { totalHours: 22 } })
  await prisma.volunteerProfile.update({ where: { id: vol3.id }, data: { totalHours: 18 } })

  console.log('✅ Attendance records created')

  // ------------------------------------------------------------------
  // CERTIFICATES
  // ------------------------------------------------------------------
  await prisma.certificate.upsert({
    where: { id: 'cert-001' },
    update: {},
    create: {
      id: 'cert-001',
      volunteerId: vol3.id,
      projectId: project2.id,
      title: 'Certificate of Contribution – Clean Water Access Programme',
      hours: 18,
      ipfsHash: 'QmCert1234abcdef5678901234567890abcdef1234567890',
      blockchainTx: '0xcert111aaa222bbb333ccc444ddd555eee666fff777aaa',
      issuedAt: new Date('2024-07-05'),
    },
  })

  await prisma.certificate.upsert({
    where: { id: 'cert-002' },
    update: {},
    create: {
      id: 'cert-002',
      volunteerId: vol1.id,
      projectId: project1.id,
      title: 'Volunteer Excellence Award – Digital Literacy Programme',
      hours: 36,
      ipfsHash: 'QmCert5678cdef1234abcd567890abcdef5678901234',
      blockchainTx: '0xcert222bbb333ccc444ddd555eee666fff777aaa888bbb',
      issuedAt: new Date('2024-08-01'),
    },
  })

  console.log('✅ Certificates created')
  console.log('')
  console.log('🎉 Seed complete! Login credentials:')
  console.log('   NGO:       greenearth@ngo.org      / demo1234')
  console.log('   NGO:       saathicare@ngo.org      / demo1234')
  console.log('   Company:   csr@techcorp.in          / demo1234')
  console.log('   Company:   csr@infrabuilders.in     / demo1234')
  console.log('   Volunteer: arjun.volunteer@gmail.com / demo1234')
  console.log('   Volunteer: sneha.vol@gmail.com       / demo1234')
  console.log('   Volunteer: karan.helps@gmail.com     / demo1234')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
