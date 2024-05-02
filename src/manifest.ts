import packageJson from '../package.json';
import { ManifestType } from '@src/manifest-type';

const manifest: ManifestType = {
  manifest_version: 3,
  name: 'LittleSis Browser Utils',
  version: packageJson.version,
  description: packageJson.description,
  permissions: ['sidePanel', 'activeTab', 'storage', 'tabs'],
  action: {
    default_title: 'click to open side panel',
  },
  side_panel: {
    default_path: 'src/sidepanel/index.html',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*', '<all_urls>'],
      js: ['src/content/index.js'],
    },
  ],
  icons: {
    '24': 'icon-24.png',
    '96': 'icon-96.png',
  },
  background: { service_worker: 'src/background/index.js' },
  host_permissions: ['https://littlesis.org/*', 'http://localhost:8080/*'],
};

export default manifest;
