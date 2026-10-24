# DukaanSpatial: Technical Architecture & 3D Spatial Pipeline Specification

## Executive Summary
DukaanSpatial is an end-to-end 3D WebGL & Augmented Reality (WebXR) spatial commerce infrastructure designed for Indian D2C brands, local merchants, and e-commerce enterprises.

## System Architecture
1. **PBR Real-Time Renderer**: Powered by WebGL2 and Google Filament runtime (`<model-viewer>`).
2. **Dynamic Material Swapping**: High-speed runtime shader alteration without reloading geometry.
3. **WebXR AR Pipeline**: Zero-app QuickLook (USDZ for iOS) and SceneViewer (WebXR for Android) triggered via 1-click QR code.
4. **Universal 1-Line Embed**: Standardized iframe SDK compatible with Shopify, Dukaan, WooCommerce, Magento, and custom React/Next.js store fronts.

## Unit Economics & SaaS Pricing
* Free Tier: 3 Active 3D SKUs, 5,000 monthly impressions.
* Growth Plan (INR 499/month): Unlimited 3D SKUs, 100,000 impressions, Custom Branding, AR Analytics.
* Enterprise (INR 1,499/month): Dedicated 3D conversion pipeline, SLA, Priority CDN, Blender pipeline API.
