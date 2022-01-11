export abstract class Constants {

  static readonly committees: string[] = [
    '9 @ Yuan Ching NC',
    'Caspian NC',
    'Lakefront Residences NC',
    'Lakeholmz Condo NC',
    'Lakelife RN',
    'Lakeside Grove NC',
    'Taman Jurong Zone A RN',
    'Taman Jurong Zone B RC',
    'Taman Jurong Zone C RN',
    'Taman Jurong Zone D RC',
    'Taman Jurong Zone E RC',
    'Taman Jurong Zone F RC',
    'Taman Jurong Zone G RN'];

  static readonly blkNum: string[] = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
    '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60',
    '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80',
    '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '93', '95', '97', '99', '101',

  ];

  static readonly status: string[] = [
    'Active',
    'Inactive'];

  static readonly variables: string[] = [
    'LastUpdatedDate',
    'LastUpdatedTime',
    'blockNumber',
    'committee',
    'email',
    'firstName',
    'gender',
    'phoneNumber',
    'registrationTime',
    'registrationDate',
    'role',
    'status',
    'userName',
  ];

  static readonly roles: string[] = [
    "Admin",
    "CC staff",
    "Key Ccc",
    "RN Manager",
    "Key RN Manager",
    "Normal RN Manager"];

  static readonly genders: string[] = [
    'Male',
    'Female'];

  static readonly ageGps: string[] = [
    'Toddler (below 5)',
    'Child (6-12)',
    'Teenager (13-19)',
    'Youth (20-25)',
    'Adult (26-54)',
    'Senior (55 onwards)'];

  static readonly activities: string[] = [
    'Small Social Activities',
    'Family Bonding Activities',
    'Art and Craft',
    'Overseas Trip'];
}
