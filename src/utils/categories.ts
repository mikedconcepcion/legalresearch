export interface LawCategory {
  id: string
  name: string
  icon: string
  description: string
  topics: string[]
  color: string
}

export const LAW_CATEGORIES: LawCategory[] = [
  {
    id: 'constitutional',
    name: 'Constitutional Law',
    icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z',
    description: 'Separation of powers, bill of rights, judicial review, emergency powers',
    topics: ['Constitutional Law', 'Separation of Powers', 'Judicial Review', 'Bill of Rights', 'Emergency Powers', 'Due Process', 'Equal Protection', 'Executive Power', 'Impeachment', 'Political Question', 'Martial Law', 'Ratification', 'Constitution', 'Delegation of Powers', 'Constructive Resignation', 'People Power', 'Presidency', 'Appropriations', 'Pork Barrel', 'Accountability', 'Disbursement Acceleration Program', 'Fiscal Policy', 'Fiscal Autonomy'],
    color: 'from-blue-600 to-blue-800',
  },
  {
    id: 'civil-liberties',
    name: 'Civil Liberties & Human Rights',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m12 0a4 4 0 10-8 0',
    description: 'Freedom of expression, privacy, religious freedom, right to travel',
    topics: ['Civil Liberties', 'Freedom of Expression', 'Freedom of the Press', 'Press Freedom', 'Prior Restraint', 'Privacy', 'Religious Freedom', 'Right to Travel', 'Right to Life', 'Reproductive Rights', 'Habeas Corpus', 'Human Rights', 'Liberty', 'Search and Seizure', 'Cybercrime', 'Public Morals'],
    color: 'from-emerald-600 to-emerald-800',
  },
  {
    id: 'criminal',
    name: 'Criminal Law',
    icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707',
    description: 'Plunder, death penalty, criminal procedure, probation',
    topics: ['Criminal Law', 'Plunder', 'Death Penalty', 'Cruel and Unusual Punishment', 'Void for Vagueness', 'Probation Law'],
    color: 'from-red-600 to-red-800',
  },
  {
    id: 'civil',
    name: 'Civil Law',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    description: 'Obligations, contracts, property, torts, family law, succession',
    topics: ['Civil Law', 'Obligations and Contracts', 'Breach of Contract', 'Damages', 'Torts', 'Property Law', 'Land Registration', 'Native Title', 'Regalian Doctrine', 'Public Domain', 'Forfeiture', 'Ill-gotten Wealth', 'Trust', 'Solutio Indebiti', 'Indemnity', 'Subrogation'],
    color: 'from-amber-600 to-amber-800',
  },
  {
    id: 'family',
    name: 'Family Law',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    description: 'Marriage, psychological incapacity, declaration of nullity',
    topics: ['Family Law', 'Marriage', 'Psychological Incapacity', 'Declaration of Nullity'],
    color: 'from-pink-600 to-pink-800',
  },
  {
    id: 'labor',
    name: 'Labor Law',
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    description: 'Dismissal, due process, OFW rights, employer obligations',
    topics: ['Labor Law', 'Overseas Workers', 'Dismissal', 'Procedural Requirements', 'Contracts'],
    color: 'from-orange-600 to-orange-800',
  },
  {
    id: 'admin',
    name: 'Administrative Law',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    description: 'Police power, local government, administrative agencies, publication',
    topics: ['Administrative Law', 'Police Power', 'Local Government', 'Publication Requirement', 'Health Law', 'Social Justice', 'Public Welfare', 'Internal Revenue Allotment'],
    color: 'from-violet-600 to-violet-800',
  },
  {
    id: 'taxation',
    name: 'Taxation',
    icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    description: 'Income tax, VAT, donor\'s tax, tax exemptions, withholding tax',
    topics: ['Taxation', 'Income Tax', 'Tax Exemptions', 'Statutory Construction', 'Value-Added Tax', 'Creditable Withholding Tax', "Donor's Tax", 'Charitable Donations', 'Real Estate'],
    color: 'from-teal-600 to-teal-800',
  },
  {
    id: 'international',
    name: 'International & Treaty Law',
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064',
    description: 'Extradition, VFA, sovereignty, international trade',
    topics: ['International Law', 'Treaty Law', 'Visiting Forces Agreement', 'Sovereignty', 'Extradition', 'Bail', 'TRIPS Agreement', 'International Trade'],
    color: 'from-cyan-600 to-cyan-800',
  },
  {
    id: 'special',
    name: 'Special Laws',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    description: 'Environmental, agrarian reform, election, banking, insurance, IP',
    topics: ['Environmental Law', 'Intergenerational Rights', 'Standing', 'Agrarian Reform', 'Just Compensation', 'Social Justice', 'Election Law', 'Suffrage', 'Overseas Voting', 'Absentee Voting', 'Banking Law', 'Negotiable Instruments', 'Checks', 'Forgery', 'Insurance Law', 'Marine Insurance', 'Intellectual Property', 'Patents', 'Libel', 'Indigenous Peoples', 'Indigenous Peoples Rights', 'Privatization', 'Filipino First Policy', 'National Economy', 'Quo Warranto', 'Judicial Independence'],
    color: 'from-slate-600 to-slate-800',
  },
]

export function getCategoryForTopic(topic: string): LawCategory | undefined {
  return LAW_CATEGORIES.find(cat => cat.topics.includes(topic))
}

export function getCategoryColor(topic: string): string {
  const cat = getCategoryForTopic(topic)
  return cat?.color || 'from-slate-600 to-slate-800'
}
