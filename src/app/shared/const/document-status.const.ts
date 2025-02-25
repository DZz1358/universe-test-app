export const documentStatuses = [
  {
    value: 'DRAFT', viewValue: 'Draft'
  },
  {
    value: 'REVOKE', viewValue: 'Revoke'
  },
  {
    value: 'READY_FOR_REVIEW', viewValue: 'Ready for review'
  },
  {
    value: 'UNDER_REVIEW', viewValue: 'Under review'
  },
  {
    value: 'APPROVED', viewValue: 'Approved'
  },
  {
    value: 'DECLINED', viewValue: 'Declined'
  },
];

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  REVOKE = 'REVOKE',
  READY_FOR_REVIEW = 'READY_FOR_REVIEW',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
}
