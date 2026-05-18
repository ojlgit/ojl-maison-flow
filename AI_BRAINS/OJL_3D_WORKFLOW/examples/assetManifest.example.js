export const USE_EXTERNAL_ASSETS = false;

export const assetManifest = {
  products: {
    ringGeometry: {
      id: 'ringGeometry',
      enabled: false,
      type: 'product',
      path: '/assets/models/products/ojl-ring-geometry.v001.glb',
      fallback: 'proceduralRing',
      materialPreset: 'ojlLuxuryGoldGem',
      scale: 1,
      position: [0, 1.35, 0],
      rotation: [0, 0, 0],
      castShadow: true,
      receiveShadow: false,
      hotspots: [
        {
          id: 'stone',
          label: 'Faceted stone',
          attachTo: 'HOTSPOT_stone',
          fallbackPosition: [0, 0.45, 0.05],
          text: 'Gemstone detail placeholder ready for real PBR material.'
        }
      ]
    }
  },
  rooms: {
    geometryVault: {
      id: 'geometryVault',
      enabled: false,
      type: 'room',
      path: '/assets/models/rooms/ojl-room-geometry-vault.v001.glb',
      fallback: 'proceduralGeometryVault',
      scale: 1,
      position: [0, 0, -18],
      rotation: [0, 0, 0],
      markers: {
        productAnchor: 'ANCHOR_product_hero',
        cameraEntrance: 'CAM_entrance',
        cameraHero: 'CAM_hero',
        cameraExit: 'CAM_exit',
        lookHero: 'LOOK_hero'
      }
    }
  },
  environments: {
    warmGallery: {
      id: 'warmGallery',
      enabled: false,
      path: '/assets/hdri/warm-gallery.v001.hdr',
      fallback: 'generatedWarmStudio',
      intensity: 0.9
    }
  },
  audio: {
    geometryVault: {
      id: 'geometryVault',
      enabled: false,
      path: '/assets/audio/geometry-vault.v001.mp3',
      fallback: 'silent',
      volume: 0.3
    }
  }
};
