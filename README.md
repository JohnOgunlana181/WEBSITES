# AUTOSAT LIMITED (RC 1643628)

**Tagline:** Premium cars. Delivered across Nigeria.  
**Showroom:** 24 Unity Road, Ikeja, Lagos (near Lateef Jakande Road, Agidingbi, Ikeja)  
**Hours:** Mon–Fri 8:00 AM–8:00 PM · Sat 10:00 AM–8:00 PM · Sun 12:00 PM–6:00 PM  
**Phone / WhatsApp:** +234 913 867 8236 · +234 818 353 3837  

---

## Tech Stack
- **React 19 + Vite + TypeScript**
- **Tailwind CSS v4**
- **Three.js (`@react-three/fiber`, `@react-three/drei`)** with GLB/GLTF loader + procedural 3D studio vehicle fallback
- **Motion (`motion/react`)** for smooth page transitions and parallax hero
- **React Router (`react-router-dom`)**
- **PWA (`vite-plugin-pwa`)** for offline caching & mobile home-screen installation

---

## Running Locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

---

## Managing Inventory (`/admin` & `/src/data/cars.json`)

### Option 1: Built-in Staff Portal (`/admin`)
1. Navigate to `/admin`.
2. Enter the staff passcode: `AUTOSAT2026` (change `STAFF_PASSCODE` in `src/pages/AdminPage.tsx` before deploying to production).
3. Add new cars, edit prices/specs, toggle **Available / Sold**, or delete listings. Changes save immediately to `localStorage`.
4. Click **Export cars.json** to download an updated `cars.json` file that you can commit directly into `src/data/cars.json`.

### Option 2: Editing `src/data/cars.json` Directly
Add a new vehicle object with the following fields:

```json
{
  "id": "lexus-lx-570-2021",
  "brand": "Lexus",
  "model": "LX 570 Superior",
  "year": 2021,
  "price": 125000000,
  "negotiable": true,
  "condition": "Foreign Used",
  "bodyType": "SUV",
  "fuel": "Petrol",
  "transmission": "Automatic",
  "engine": "5.7L V8",
  "horsepower": "383 hp",
  "drivetrain": "4WD",
  "mileage": 21000,
  "seats": 7,
  "vin": "JTJHY7AX8M4300123",
  "location": "24 Unity Road, Ikeja, Lagos",
  "features": ["Panoramic Camera", "Mark Levinson Audio", "Cool Box"],
  "colors": [
    {
      "name": "Caviar Black",
      "hex": "#16181B",
      "images": ["/images/cars/lx570-black-front.webp"],
      "modelOverrideHex": "#16181B"
    }
  ],
  "model3d": "/models/lx570.glb",
  "interior360": "/images/cars/lx570-interior.webp",
  "images": ["/images/cars/lx570-black-front.webp"],
  "videoUrl": "/videos/lx570-walkaround.mp4",
  "description": "Clean Nigerian used LX 570 with customs duty paid.",
  "status": "available"
}
```

---

## Media Guide (Photos, Videos & 3D Models)

Do **not** hotlink third-party dealership images. Replace placeholder assets with verified local files placed inside `/public/`:

### 1. Real Showroom Photos (`/public/images/cars/`)
- **What buyers trust most:** Take real photos inside the 24 Unity Road, Ikeja showroom or clean outdoor compound during morning/late-afternoon light.
- **Recommended shots per vehicle:**
  1. Front 3/4 exterior
  2. Rear 3/4 exterior
  3. Side profile
  4. Driver cockpit & dashboard (showing odometer & infotainment)
  5. Rear seating & boot space
  6. Engine bay & VIN plate (optional)
- **Mobile speed optimization:** Convert photos to `.webp` or compressed `.jpg` (target `1200x900` px, under `180 KB` per photo) so Lagos/nationwide buyers on 3G/4G mobile connections load galleries instantly.

### 2. Manufacturer Press / Media-Kit Images & Videos (`/public/videos/`)
- If using manufacturer photography or B-roll clips, use official press/media-kit assets licensed for retail use or your own filmed showroom walkaround MP4s (`H.264`, 720p/1080p, muted/compressed under `8 MB` for hero loop).
- Update `videoUrl` in `cars.json` to `/videos/your-car-walkaround.mp4`.

### 3. Licensed 3D Models (`.glb` / `.gltf` in `/public/models/`)
- Source properly licensed `.glb` models from **Sketchfab** (verify Creative Commons or Commercial license terms), manufacturer press configurators, or a commissioned 3D automotive artist.
- **Keep `.glb` files lightweight:** Run Draco compression (`gltf-transform optimize input.glb output.glb --compress draco`) so each model is **1 MB – 4 MB** for fast mobile loading.
- **Live Colour Switcher compatibility:** Name the exterior body paint material in Blender/Maya with `paint`, `body`, `coat`, or `exterior` (e.g., `CarPaint_Body`). The 3D viewer automatically detects those material names and updates `color`, `metalness`, and `roughness` when a buyer taps any colour swatch.
- **Graceful Fallback:** If `model3d` is blank (`""`) or fails to load, the 3D viewer automatically renders a body-type-matched interactive 3D studio vehicle with working exterior/interior camera and colour switching—zero broken screens.
