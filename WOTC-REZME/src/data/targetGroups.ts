import { TargetGroup } from '../types/wotc';

export const TARGET_GROUPS: TargetGroup[] = [
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'A person who served in the active military, naval, or air service and was discharged or released under conditions other than dishonorable.',
    selected: false
  },
  {
    id: 'snap_tanf',
    name: 'SNAP/TANF Recipient',
    description: 'A member of a family that received SNAP (food stamps) or TANF benefits for at least 3 months during the 15-month period ending on the hiring date.',
    selected: false
  },
  {
    id: 'ex_felon',
    name: 'Ex-Felon',
    description: 'A person who was convicted of a felony and is hired not more than 1 year after the last date on which the person was so convicted or was released from prison.',
    selected: false
  },
  {
    id: 'vocational_rehab',
    name: 'Vocational Rehabilitation Referral',
    description: 'A person who has a physical or mental disability and was referred to the employer upon completion of (or while receiving) rehabilitative services.',
    selected: false
  },
  {
    id: 'summer_youth',
    name: 'Summer Youth Employee',
    description: 'A person who is 16 or 17 years old on the hiring date and who has not regularly attended school during the most recent 6-month period.',
    selected: false
  },
  {
    id: 'unemployed_veteran',
    name: 'Unemployed Veteran',
    description: 'A veteran who was unemployed for at least 4 weeks (but less than 6 months) during the 1-year period ending on the hiring date.',
    selected: false
  },
  {
    id: 'disabled_veteran',
    name: 'Disabled Veteran',
    description: 'A veteran who is entitled to compensation for a service-connected disability and was unemployed for at least 6 months during the 1-year period ending on the hiring date.',
    selected: false
  },
  {
    id: 'long_term_family_assistance',
    name: 'Long-Term Family Assistance Recipient',
    description: 'A member of a family that received TANF payments for at least 18 consecutive months ending on the hiring date.',
    selected: false
  }
];