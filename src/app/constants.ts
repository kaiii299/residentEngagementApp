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

  static readonly requestStatus: string[] = [
    'Accepted',
    'Rejected',
  ]


  static readonly roles: string[] = [
    "Admin",
    "CC staff",
    "Key Ccc",
    "RN Manager",
    "Key RN Members",
    "Normal RN Members"];

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

  static readonly contact: string[] = [
    'Whats App',
    'Email'];

  static readonly zones = new Map<string, string[]>([
    ["9 @ Yuan Ching NC", ['9A', '9B', '9C', '9D', '9E', '9F', '9G', '9H']],
    ["Caspian NC", ['50', '52', '54', '56', '58', '60']],
    ["Lakefront Residences NC", ['42', '46', '48']],
    ["Lakeholmz Condo NC", ['80', '82', '84', '86', '88', '90']],
    ["Lakelife RN", ['2', '6', '8', '10', '12']],
    ["Lakeside Grove NC", ['1', '3', '4', '5', '7', '9', '11', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36',
      '37', '37', '38', '39', '40', '41', '43', '44', '45', '47', '49', '51', '53', '55', '57', '59', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74',
      '75', '76', '77', '78', '79', '81', '83', '85', '87', '89', '91', '93', '95', '97', '99', '101', '103', '105', '107', '109', '123']],
    ["Taman Jurong Zone A RN", ['151', '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '162', '163', '166', '164A', '165A', '166A', '166B']],
    ["Taman Jurong Zone B RC", ['111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '321', '322', '324', '325', '326', '327', '328', '329', '330']],
    ["Taman Jurong Zone C RN", ['357', '358', '359', '360', '361', '362', '363', '365', '366', '367', '368', '369']],
    ["Taman Jurong Zone D RC", ['331', '332', '333', '334', '335', '336', '345', '346', '347', '348', '349', '350', '351', '352', '353', '354', '355']],
    ["Taman Jurong Zone E RC", ['337A', '337B', '337C', '337D', '338A', '338B', '339A', '339B', '339C', '339D']],
    ["Taman Jurong Zone F RC", ['177', '178', '179', '180', '181', '182', '183', '184', '175A', '175B', '175C']],
    ["Taman Jurong Zone G RN", ['138A', '138B', '138C', '138D', '140A', '140B', '140C', '140D', '150A']],
  ]);

  static readonly baseURL: string = "https://us-central1-residentappv2-affc6.cloudfunctions.net/api";
  static readonly access_control = new Map<string, Object>([
    ["Admin", {viewSearchFilterAllResident: true, viewSearchFilterByCommittee: true, addResident: true, updateResident: true, deleteResident: true }],
    ["CC staff", {viewSearchFilterAllResident: true, viewSearchFilterByCommittee: true, addResident: true, updateResident: true, deleteResident: true }],
    ["Key Ccc", {viewSearchFilterAllResident: true, viewSearchFilterByCommittee: true, addResident: true, updateResident: true, deleteResident: false }],
    ["RN Manager", {viewSearchFilterAllResident: false, viewSearchFilterByCommittee: true, addResident: true, updateResident: true, deleteResident: true }],
    ["Key RN Members", {viewSearchFilterAllResident: false, viewSearchFilterByCommittee: true, addResident: true, updateResident: true, deleteResident: false }],
    ["Normal RN Members", {viewSearchFilterAllResident: false, viewSearchFilterByCommittee: true, addResident: true, updateResident: true, deleteResident: false}]
  ]);

    static readonly variables = [

    { name: 'Username', value: 'userName' },
    { name: 'Status', value: 'status' },
    { name: 'Email', value: 'email' },
    { name: 'First name', value: 'firstName' },
    { name: 'Gender', value: 'gender' },
    { name: 'Role', value: 'role' },
    { name: 'Block number', value: 'blockNumber' },
    { name: 'Committee', value: 'committee' },
    { name: 'Phone number', value: 'phoneNumber' },
    { name: 'Registration time', value: 'registrationTime' },
    { name: 'Registration date', value: 'registrationDate' },
    { name: 'Last updated time', value: 'LastUpdatedDate' },
    { name: 'Last updated date', value: 'LastUpdatedTime' },
    { name: 'Request status', value: 'requestStatus' },
  ];


  static readonly defaultValues = [
    'userName',
    'committee',
    'blockNumber',
    'role',
  ];

  static readonly allValues = [
    'userName',
    'committee',
    'blockNumber',
    'email',
    'role',
    'gender',
    'status',
    'firstName',
    'phoneNumber',
    'registrationDate',
    'registrationTime',
    'requestStatus',
  ];

  static readonly secretKey: string = 'YourSecretKeyForEncryption&Descryption';

  static readonly allowDeleteUser = ['Admin', 'CC staff', 'RN Manager'];

  static readonly allowDeleteCommitteUser = ['Admin','CC staff', 'RN Manager'];

  static readonly allowViewAllUsers = ['Admin', 'CC staff', 'Key Ccc', 'RN Manager', 'Key RN Members']
}
