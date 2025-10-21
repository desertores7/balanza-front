import React from 'react';

export type DropdownItem = {
  id: string;
  label: string;
};

export type NavItem = {
  id: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  dropdown?: DropdownItem[];
  route?: string;
  mainRoute?: string;
  tableKey?: string;
  onlyRole?: string;
};