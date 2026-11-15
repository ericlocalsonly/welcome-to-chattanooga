import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy" };
export default function PrivacyPage() {
  return (
    <div className="container-page prose-guide mt-10 max-w-3xl">
      <h1 className="mb-6 text-4xl font-semibold">Privacy</h1>
      <p><strong>No account required.</strong> Favorites and your temperature unit are stored only in your browser's local storage on this device. We can't see them.</p>
      <p><strong>Your location.</strong> "Use my location" asks your browser for permission only when you tap it. Your position is used on your device to sort nearby places and is never sent to or stored on our servers.</p>
      <p><strong>Submissions.</strong> If you submit an event or suggest an update, we store what you send (and your name and email, if you choose to give them) so our editors can review it.</p>
      <p><strong>Analytics.</strong> If enabled, we use cookie-free, aggregate page-view analytics that don't track you across sites.</p>
      <p><strong>Third parties.</strong> Map tiles load from OpenStreetMap. Directions open Google Maps or Apple Maps, and outbound links go to the businesses' own websites, each with its own privacy policy.</p>
    </div>
  );
}
