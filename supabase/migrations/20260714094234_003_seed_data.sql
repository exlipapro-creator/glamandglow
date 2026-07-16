/*
# Glam & Glow — Seed Data

## Overview
Populates the database with initial content:
- 6 collections (Oud Royale, Summer Glow, Signature Lips, Timeless Skin, Bridal Edition, Men's Collection)
- 24 products across collections with images, pricing, ratings
- 3 campaigns for homepage editorial banners
- 4 testimonials
- 2 store settings (delivery_fee)

All images use Pexels stock photos appropriate to beauty/cosmetics.
Prices in TZS (Tanzanian Shillings).
*/

-- ============================================================
-- COLLECTIONS
-- ============================================================
INSERT INTO collections (slug, name, tagline, description, hero_image_url, sort_order, is_published) VALUES
('oud-royale', 'Oud Royale', 'Arabic luxury fragrances', 'A curated selection of premium oud and amber fragrances inspired by the traditions of Arabian perfumery. Each scent is crafted to evoke warmth, depth, and timeless sophistication.', 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1600', 1, true),
('summer-glow', 'Summer Glow', 'Radiant beauty for the season', 'Lightweight, luminous, and effortlessly fresh. Discover bronzers, highlighters, and lip tints designed for sun-kissed skin and long summer days.', 'https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=1600', 2, true),
('signature-lips', 'Signature Lips', 'The perfect pout, defined', 'From matte velvets to high-shine glosses, our lip collection delivers pigment-rich colour that lasts. Find your signature shade.', 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=1600', 3, true),
('timeless-skin', 'Timeless Skin', 'Skincare that defies time', 'Advanced formulations with hyaluronic acid, retinol, and botanical extracts. Clean, effective, and designed for visible results.', 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=1600', 4, true),
('bridal-edition', 'Bridal Edition', 'Your most radiant day', 'Long-wear foundations, waterproof liners, and luminous highlighters curated for brides. Look flawless from ceremony to reception.', 'https://images.pexels.com/photos/3783837/pexels-photo-3783837.jpeg?auto=compress&cs=tinysrgb&w=1600', 5, true),
('mens-collection', 'Men''s Collection', 'Refined grooming essentials', 'Colognes, skincare, and grooming tools designed for the modern gentleman. Clean, confident, and understated.', 'https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=1600', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- PRODUCTS
-- ============================================================
INSERT INTO products (slug, name, brand, category, collection_id, short_description, description, notes, volume, price, compare_at_price, images, rating, review_count, badges, is_published, sort_order) VALUES

-- Oud Royale Collection
('oud-amber-noir', 'Oud Amber Noir Eau de Parfum', 'Maison Lumiere', 'Fragrance',
  (SELECT id FROM collections WHERE slug='oud-royale'),
  'A warm, woody oud fragrance with amber and vanilla undertones.',
  'Oud Amber Noir is a masterful composition that opens with spicy saffron and transitions into a rich heart of agarwood (oud) and rose. The base notes of amber, vanilla, and sandalwood create a long-lasting, luxurious trail that commands attention.',
  'Top: Saffron, Cardamom. Heart: Agarwood (Oud), Rose. Base: Amber, Vanilla, Sandalwood.',
  '50ml Eau de Parfum',
  185000, 220000,
  ARRAY['https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/264819/pexels-photo-264819.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.8, 127, ARRAY['Best Seller', 'Sale'], true, 1),

('royal-rose-oud', 'Royal Rose Oud Extrait', 'Maison Lumiere', 'Fragrance',
  (SELECT id FROM collections WHERE slug='oud-royale'),
  'An intense extrait blending Damask rose with Cambodian oud.',
  'Royal Rose Oud is a high-concentration extrait de parfum that marries the floral richness of Damask rose with the deep, smoky depth of Cambodian oud. A few drops deliver hours of intoxicating sillage.',
  'Top: Pink Pepper. Heart: Damask Rose, Geranium. Base: Cambodian Oud, Patchouli, Musk.',
  '30ml Extrait de Parfum',
  240000, NULL,
  ARRAY['https://images.pexels.com/photos/264783/pexels-photo-264783.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.9, 89, ARRAY['New', 'Premium'], true, 2),

('midnight-musk', 'Midnight Musk Eau de Parfum', 'Glam & Glow', 'Fragrance',
  (SELECT id FROM collections WHERE slug='oud-royale'),
  'A sensual musk fragrance with powdery and woody accords.',
  'Midnight Musk is an elegant, skin-close fragrance that blends white musk with powdery iris and warm cedarwood. Soft, intimate, and perfect for evening wear.',
  'Top: Bergamot. Heart: Iris, White Musk. Base: Cedarwood, Amber.',
  '75ml Eau de Parfum',
  145000, NULL,
  ARRAY['https://images.pexels.com/photos/2064183/pexels-photo-2064183.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.6, 64, ARRAY['Best Seller'], true, 3),

('golden-amber-elixir', 'Golden Amber Elixir', 'Maison Lumiere', 'Fragrance',
  (SELECT id FROM collections WHERE slug='oud-royale'),
  'A unisex amber-forward fragrance with warm spice.',
  'Golden Amber Elixir is a radiant composition centered on amber, enriched with cinnamon, nutmeg, and a smooth tonka bean base. Warm, inviting, and universally flattering.',
  'Top: Cinnamon, Nutmeg. Heart: Amber, Labdanum. Base: Tonka Bean, Benzoin.',
  '50ml Eau de Parfum',
  165000, NULL,
  ARRAY['https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.7, 52, ARRAY['New'], true, 4),

-- Summer Glow Collection
('sunlit-bronzer', 'Sunlit Bronzer Powder', 'Glam & Glow', 'Makeup',
  (SELECT id FROM collections WHERE slug='summer-glow'),
  'A silky-matte bronzer for a natural sun-kissed glow.',
  'Achieve a radiant, sun-kissed complexion with our finely milled bronzer. The silky-matte formula blends seamlessly for a natural warmth that never looks orange or patchy.',
  'Silica, Mica, Iron Oxides. Buildable from soft to deep.',
  '10g Compact',
  42000, NULL,
  ARRAY['https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.5, 38, ARRAY['Best Seller'], true, 1),

('liquid-highlighter-gold', 'Liquid Gold Highlighter', 'Glam & Glow', 'Makeup',
  (SELECT id FROM collections WHERE slug='summer-glow'),
  'A dewy liquid highlighter for a luminous, lit-from-within glow.',
  'Our liquid highlighter delivers a buildable, dewy glow that melts into skin. The lightweight formula can be worn alone, mixed with foundation, or layered on cheekbones for a radiant finish.',
  'Light-reflecting pigments in a hydrating water-gel base.',
  '15ml Bottle',
  38000, 48000,
  ARRAY['https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.7, 71, ARRAY['Sale'], true, 2),

('lip-tint-coral', 'Coral Crush Lip & Cheek Tint', 'Glam & Glow', 'Makeup',
  (SELECT id FROM collections WHERE slug='summer-glow'),
  'A versatile lip and cheek tint in a warm coral shade.',
  'A multitasking tint that delivers a natural flush of colour to lips and cheeks. The buildable, water-based formula is lightweight and comfortable for all-day wear.',
  'Water-based, buildable. Shade: Coral Crush.',
  '10ml Tube',
  28000, NULL,
  ARRAY['https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.4, 45, ARRAY['New'], true, 3),

('bronze-glow-set', 'Bronze Glow Travel Set', 'Glam & Glow', 'Sets',
  (SELECT id FROM collections WHERE slug='summer-glow'),
  'A travel-ready set with bronzer, highlighter, and lip tint.',
  'Everything you need for a summer glow on the go. This curated set includes mini sizes of our Sunlit Bronzer, Liquid Gold Highlighter, and Coral Crush Lip Tint in a compact travel pouch.',
  'Includes: Bronzer (5g), Highlighter (8ml), Lip Tint (5ml).',
  '3-piece Set',
  95000, 120000,
  ARRAY['https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.9, 33, ARRAY['Best Seller', 'Sale', 'Set'], true, 4),

-- Signature Lips Collection
('velvet-matte-lipstick-crimson', 'Velvet Matte Lipstick — Crimson', 'Glam & Glow', 'Makeup',
  (SELECT id FROM collections WHERE slug='signature-lips'),
  'A richly pigmented matte lipstick in a deep crimson red.',
  'Our Velvet Matte Lipstick delivers intense, one-swipe colour in a comfortable matte finish. The long-wearing formula is enriched with vitamin E and jojoba oil for non-drying wear.',
  'Vitamin E, Jojoba Oil. Shade: Crimson (deep red).',
  '3.5g Bullet',
  32000, NULL,
  ARRAY['https://images.pexels.com/photos-2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.6, 58, ARRAY['Best Seller'], true, 1),

('gloss-lacquer-clear', 'High-Shine Lip Lacquer — Clear', 'Glam & Glow', 'Makeup',
  (SELECT id FROM collections WHERE slug='signature-lips'),
  'A non-sticky, high-shine lip gloss in a universally flattering clear shade.',
  'Our High-Shine Lip Lacquer delivers a glass-like finish without the stickiness. The hydrating formula with hyaluronic acid keeps lips plump and moisturized for hours.',
  'Hyaluronic Acid, Vitamin E. Shade: Clear (universal).',
  '6ml Tube',
  25000, NULL,
  ARRAY['https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.5, 42, ARRAY['New'], true, 2),

('lip-liner-nude', 'Precision Lip Liner — Nude Rose', 'Glam & Glow', 'Makeup',
  (SELECT id FROM collections WHERE slug='signature-lips'),
  'A creamy, long-wearing lip liner in a versatile nude rose.',
  'Define and shape your lips with our creamy Precision Lip Liner. The waterproof formula glides on smoothly and prevents feathering for a clean, defined lip look.',
  'Waterproof, creamy. Shade: Nude Rose.',
  '1.2g Pencil',
  18000, NULL,
  ARRAY['https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.3, 29, ARRAY['Best Seller'], true, 3),

('matte-lip-kit-mauve', 'Velvet Matte Lip Kit — Mauve', 'Glam & Glow', 'Sets',
  (SELECT id FROM collections WHERE slug='signature-lips'),
  'A coordinated lip kit with liner and matching matte lipstick.',
  'The perfect pairing: our Precision Lip Liner and Velvet Matte Lipstick in a coordinated mauve shade. Designed for a defined, long-lasting lip look.',
  'Includes: Lip Liner (Nude Rose) + Lipstick (Mauve).',
  '2-piece Kit',
  45000, NULL,
  ARRAY['https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.7, 24, ARRAY['Set'], true, 4),

-- Timeless Skin Collection
('hyaluronic-serum', 'Hyaluronic Hydra Serum', 'Lumiere Skin', 'Skincare',
  (SELECT id FROM collections WHERE slug='timeless-skin'),
  'A multi-weight hyaluronic acid serum for deep hydration.',
  'Our Hydra Serum combines three molecular weights of hyaluronic acid to hydrate at multiple layers of the skin. Plumps fine lines, smooths texture, and locks in moisture for a dewy, youthful complexion.',
  'Multi-weight Hyaluronic Acid, Panthenol, Glycerin.',
  '30ml Dropper Bottle',
  68000, NULL,
  ARRAY['https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/3737599/pexels-photo-3737599.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.8, 94, ARRAY['Best Seller'], true, 1),

('retinol-night-cream', 'Retinol Renewal Night Cream', 'Lumiere Skin', 'Skincare',
  (SELECT id FROM collections WHERE slug='timeless-skin'),
  'A gentle retinol night cream for smoother, firmer skin.',
  'Our Renewal Night Cream combines encapsulated retinol with peptides and ceramides to smooth fine lines, improve texture, and support the skin barrier. Gentle enough for nightly use.',
  'Encapsulated Retinol 0.3%, Peptides, Ceramides, Shea Butter.',
  '50ml Jar',
  85000, NULL,
  ARRAY['https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/3737599/pexels-photo-3737599.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.7, 67, ARRAY['Premium'], true, 2),

('vitamin-c-brightening', 'Vitamin C Brightening Drops', 'Lumiere Skin', 'Skincare',
  (SELECT id FROM collections WHERE slug='timeless-skin'),
  'A potent vitamin C serum for radiant, even-toned skin.',
  'Brightening Drops deliver 15% THD vitamin C to fade dark spots, even skin tone, and boost radiance. The stable, oil-soluble formula is gentle on sensitive skin.',
  '15% THD Vitamin C, Niacinamide, Vitamin E.',
  '20ml Dropper Bottle',
  72000, 88000,
  ARRAY['https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/3737599/pexels-photo-3737599.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.6, 51, ARRAY['Sale'], true, 3),

('skincare-ritual-set', 'The Complete Skincare Ritual Set', 'Lumiere Skin', 'Sets',
  (SELECT id FROM collections WHERE slug='timeless-skin'),
  'A four-step skincare ritual: cleanser, serum, night cream, and SPF.',
  'Everything you need for a complete daily skincare routine. This set includes our Gentle Gel Cleanser, Hyaluronic Hydra Serum, Retinol Renewal Night Cream, and Daily Mineral SPF 30.',
  'Cleanser (100ml) + Serum (30ml) + Night Cream (50ml) + SPF 30 (50ml).',
  '4-piece Set',
  210000, 255000,
  ARRAY['https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/3737599/pexels-photo-3737599.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.9, 38, ARRAY['Best Seller', 'Sale', 'Set', 'Premium'], true, 4),

-- Bridal Edition
('long-wear-foundation-ivory', 'Bridal Long-Wear Foundation — Ivory', 'Glam & Glow', 'Makeup',
  (SELECT id FROM collections WHERE slug='bridal-edition'),
  'A 24-hour wear foundation with a luminous matte finish.',
  'Our Bridal Long-Wear Foundation delivers flawless, photo-ready coverage that lasts from morning vows to the last dance. The lightweight, breathable formula controls shine while maintaining a natural luminosity.',
  '24-hour wear. Shade: Ivory (fair with warm undertones).',
  '30ml Bottle',
  75000, NULL,
  ARRAY['https://images.pexels.com/photos/3783837/pexels-photo-3783837.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.8, 43, ARRAY['Best Seller', 'Premium'], true, 1),

('waterproof-eyeliner-jet', 'Waterproof Gel Eyeliner — Jet Black', 'Glam & Glow', 'Makeup',
  (SELECT id FROM collections WHERE slug='bridal-edition'),
  'A waterproof gel liner for precise, long-lasting definition.',
  'Our Waterproof Gel Eyeliner glides on smoothly for precise lines or smudged smokey looks. The waterproof formula lasts through tears, humidity, and long celebrations.',
  'Waterproof, smudge-proof. Shade: Jet Black.',
  '1.5g Pot',
  30000, NULL,
  ARRAY['https://images.pexels.com/photos/3783837/pexels-photo-3783837.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.7, 56, ARRAY['Best Seller'], true, 2),

('bridal-glow-set', 'Bridal Radiance Complete Set', 'Glam & Glow', 'Sets',
  (SELECT id FROM collections WHERE slug='bridal-edition'),
  'A complete bridal makeup set with foundation, liner, highlighter, and lipstick.',
  'Look flawless on your special day with our curated Bridal Radiance Set. Includes Long-Wear Foundation, Waterproof Gel Eyeliner, Liquid Gold Highlighter, and Velvet Matte Lipstick in a coordinated nude-pink shade.',
  'Foundation + Eyeliner + Highlighter + Lipstick. Premium gift box.',
  '4-piece Set',
  185000, 230000,
  ARRAY['https://images.pexels.com/photos/3783837/pexels-photo-3783837.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.9, 27, ARRAY['Sale', 'Set', 'Premium'], true, 3),

('setting-spray-matte', 'Bridal Setting Spray — Matte Finish', 'Glam & Glow', 'Makeup',
  (SELECT id FROM collections WHERE slug='bridal-edition'),
  'A weightless setting spray that locks makeup in place for 16 hours.',
  'Our Bridal Setting Spray creates a weightless, invisible shield that keeps makeup in place for up to 16 hours. Controls oil, reduces shine, and ensures a flawless matte finish.',
  '16-hour hold, matte finish. Alcohol-free.',
  '60ml Spray Bottle',
  35000, NULL,
  ARRAY['https://images.pexels.com/photos/3783837/pexels-photo-3783837.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.6, 31, ARRAY['New'], true, 4),

-- Men's Collection
('mens-cologne-cedar', 'Cedar & Leather Cologne', 'Glam & Glow', 'Fragrance',
  (SELECT id FROM collections WHERE slug='mens-collection'),
  'A refined woody cologne with cedar, leather, and vetiver.',
  'Cedar & Leather is a confident, masculine fragrance that opens with bergamot and black pepper, develops into a heart of cedar and leather, and settles on a warm base of vetiver and amber.',
  'Top: Bergamot, Black Pepper. Heart: Cedar, Leather. Base: Vetiver, Amber.',
  '100ml Eau de Toilette',
  125000, NULL,
  ARRAY['https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.7, 48, ARRAY['Best Seller'], true, 1),

('mens-face-wash', 'Daily Charcoal Face Wash', 'Glam & Glow', 'Skincare',
  (SELECT id FROM collections WHERE slug='mens-collection'),
  'A detoxifying charcoal face wash for fresh, clean skin.',
  'Our Daily Charcoal Face Wash deeply cleanses and detoxifies with activated charcoal and salicylic acid. Removes excess oil, dirt, and impurities without stripping the skin.',
  'Activated Charcoal, Salicylic Acid, Aloe Vera.',
  '150ml Tube',
  35000, NULL,
  ARRAY['https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.5, 36, ARRAY['New'], true, 2),

('mens-grooming-kit', 'The Gentleman''s Grooming Kit', 'Glam & Glow', 'Sets',
  (SELECT id FROM collections WHERE slug='mens-collection'),
  'A complete grooming kit with face wash, moisturizer, and cologne.',
  'Everything the modern gentleman needs. This kit includes Daily Charcoal Face Wash, Daily Moisturizer with SPF 20, and a travel-size Cedar & Leather Cologne in a sleek leather case.',
  'Face Wash (150ml) + Moisturizer (50ml) + Cologne (30ml).',
  '3-piece Kit',
  175000, 210000,
  ARRAY['https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=900', 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.8, 22, ARRAY['Sale', 'Set'], true, 3),

('mens-beard-oil', 'Conditioning Beard Oil', 'Glam & Glow', 'Skincare',
  (SELECT id FROM collections WHERE slug='mens-collection'),
  'A lightweight beard oil for soft, conditioned facial hair.',
  'Our Conditioning Beard Oil nourishes and softens facial hair with a blend of argan, jojoba, and cedarwood oils. Reduces itchiness and adds a subtle, refined scent.',
  'Argan Oil, Jojoba Oil, Cedarwood Oil.',
  '30ml Dropper Bottle',
  32000, NULL,
  ARRAY['https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=900'],
  4.6, 19, ARRAY['New'], true, 4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- CAMPAIGNS
-- ============================================================
INSERT INTO campaigns (slug, title, subtitle, body, hero_image_url, cta_label, cta_link, sort_order, is_active) VALUES
('oud-royale-launch', 'Oud Royale', 'Where tradition meets luxury', 'Discover our new collection of Arabic luxury fragrances. Oud, amber, and rose — crafted for those who appreciate the extraordinary.', 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1600', 'Explore Collection', '/collections/oud-royale', 1, true),
('summer-edit-2024', 'The Summer Edit', 'Radiance for every day', 'Lightweight, luminous, and effortlessly fresh. Discover bronzers, highlighters, and lip tints designed for sun-kissed skin.', 'https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=1600', 'Shop Summer', '/collections/summer-glow', 2, true),
('bridal-appointment', 'Bridal Edition', 'Your most radiant day', 'Book a complimentary bridal consultation and discover our long-wear, photo-ready makeup collection designed for your special day.', 'https://images.pexels.com/photos/3783837/pexels-photo-3783837.jpeg?auto=compress&cs=tinysrgb&w=1600', 'Discover Bridal', '/collections/bridal-edition', 3, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- TESTIMONIALS
-- ============================================================
INSERT INTO testimonials (name, location, rating, quote, product_name, sort_order, is_published) VALUES
('Aisha M.', 'Dar es Salaam', 5, 'The Oud Amber Noir is absolutely stunning. I receive compliments every time I wear it. The packaging feels so luxurious, and the scent lasts all day.', 'Oud Amber Noir Eau de Parfum', 1, true),
('Sarah K.', 'Arusha', 5, 'I ordered the Complete Skincare Ritual Set and my skin has never looked better. The hyaluronic serum is a game-changer. Worth every shilling.', 'The Complete Skincare Ritual Set', 2, true),
('Mariam H.', 'Dar es Salaam', 5, 'The Bridal Radiance Set was perfect for my wedding. My makeup looked flawless from the ceremony through the reception. Highly recommend!', 'Bridal Radiance Complete Set', 3, true),
('James O.', 'Mwanza', 4, 'The Cedar & Leather cologne has become my signature scent. Clean, masculine, and long-lasting. The grooming kit is excellent value.', 'Cedar & Leather Cologne', 4, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- STORE SETTINGS
-- ============================================================
INSERT INTO store_settings (key, value, label, type) VALUES
('delivery_fee', '5000', 'Standard Delivery Fee (TZS)', 'number'),
('whatsapp_number', '255712345678', 'WhatsApp Order Number', 'text')
ON CONFLICT (key) DO NOTHING;
