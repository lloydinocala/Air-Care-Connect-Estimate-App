import { useState, useRef, useEffect, useCallback } from "react";
import { DUCT_ROOMS, DUCT_AHU, DUCT_LAST, DUCT_TYPES, DUCT_VENTS, offeredServices, buildDuctQuote, ductSettings, supplyCount } from "./ductQuote";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  bg: "#CAEEFB", blue: "#00B0F0", white: "#FFFFFF",
  navy: "#163E64", black: "#000000", gray: "#D9D9D9",
  aireAccent: "#C2693B", green: "#16a34a", gold: "#f59e0b",
};
const SHADOW = "6px 6px 12px rgba(0,0,0,0.22)";
const SHADOW_SM = "3px 3px 8px rgba(0,0,0,0.16)";
const FONT = "'Nunito', 'Segoe UI', sans-serif";
const SUPABASE_URL = "https://dalertxugwgkfsyizmly.supabase.co";
const FTL_DEALER_LINK = "https://beta.apptracker.ftlfinance.com/C214404";
const MICROF_DEALER_LINK = "https://dealer.microf.com/?did=5cF7bP6dM1wH4sX8wB";
const STRIPE_PUBLISHABLE_KEY = "pk_live_51TlgwUErPdNOiScKlm2DJkwMPJk0o7QmN6U7Q9h2DzFUVUjBEkRXRwsTANjwWnyeFsdb8ysSbEoqP6VlKFAHvQbG00CwKOJwM0";
const SUPABASE_KEY = "sb_publishable_nPaxXCiHyZkO8MkRsz-1Zw_ZgPBlybk";

// ── BRAND CONFIG ──────────────────────────────────────────────────────────────
const BRAND = {
  en: { name: "Air-Care Connect", accent: C.navy, tagline: "COMFORT · TRUST · GUARANTEED" },
  es: { name: "Aire Azul", accent: C.aireAccent, tagline: "CONFORT · CONFIANZA · GARANTIZADO" },
};

// ── TRANSLATIONS ──────────────────────────────────────────────────────────────
const T = {
  en: {
    taglineH: "See What a New Comfort System Could Cost for Your Home",
    startBtn: "Start My Estimate", whyDiff: "Why This App Is Different",
    gotIt: "Got It", noAppt: "No appointment required.", noCall: "No sales call required.", noCommit: "No commitment.",
    whyTitle: "Why This App Is Different",
    whyP1: "Air-Care Connect gives you a private, no-pressure way to explore AC replacement options before talking to anyone.",
    whyP2: "No salesperson will call you. No appointment is required. No commitment is needed.",
    whyP3: "Answer a few questions, review options that fit your home, and ask your Comfort Guide for help whenever you need it.",
    findHome: "Let's Find Your Home",
    findHomeDesc: "Enter the installation address so we can estimate your home details and system options.",
    addressLabel: "INSTALLATION ADDRESS", addressPlaceholder: "Start typing your address...",
    findBtn: "Find My Home", noApptShort: "No appointment required", noCallShort: "No salesperson will call",
    comfortGuide: "Need help? Ask your Comfort Guide.",
    foundHome: "We Found Your Home",
    confirmDesc: "Please confirm these details so your estimate is based on the right home.",
    confirmBtn: "Yes, This Looks Right", editBtn: "Edit Home Details",
    beds: "Beds", baths: "Baths", sqft: "SqFt", builtIn: "Built in",
    whatEstimate: "What Would You Like to Estimate?",
    replaceMain: "Replace my main home AC system", replaceMainSub: "Best for replacing your current central system.",
    addRoom: "Add comfort to one room or area", addRoomSub: "Best for bedrooms, garages, additions, or problem rooms.",
    notSure: "I'm not sure — guide me", notSureSub: "Answer a few simple questions and we'll point you in the right direction.",
    coolWell: "Has Your Existing AC Been Cooling Adequately?",
    coolWellDesc: "This helps us estimate whether your current system size has been keeping up with your home.",
    coolYes: "Yes, it cools the home well", coolUsed: "No, it used to cool well",
    coolStruggle: "No, it has always struggled", coolNotSure: "I'm not sure",
    floodZone: "Is Your Home in a Flood Zone?",
    floodDesc: "Homes in flood zones may require outdoor AC equipment to be raised.",
    floodYes: "Yes, my home is in a flood zone", floodNo: "No, my home is not in a flood zone",
    systemAge: "About How Old Is Your AC?",
    systemAgeDesc: "The age of your current AC helps us estimate whether refrigerant lines need to be replaced.",
    ageNew: "Less than 15 years old", ageOld: "More than 15 years old",
    hoaTitle: "Does an HOA or Community Office Approve AC Work?",
    hoaDesc: "Some neighborhoods, condos, and manufactured-home communities have rules about outdoor AC equipment, placement, permits, or work hours.",
    hoaYes: "Yes", hoaNo: "No",
    systemTypeTitle: "Let's Look at Your Current AC & Heating System",
    sysElectric: "It is all Electric, part Indoor and part Outdoor",
    sysElectricSub: "This is a Split System Heat Pump",
    sysPackage: "It is a Package Unit — All Outdoors",
    sysPackageSub: "Common in mobile and manufactured homes",
    sysGas: "It is a Gas Furnace & Air Conditioner System",
    sysGasSub: "Has both indoor gas furnace and outdoor AC unit",
    preparing: "Determining Your System Requirements...",
    preparingDesc: "We're using your home and AC details to build a realistic replacement estimate.",
    prepBullet1: "Matching your current setup",
    prepBullet2: "Checking installation requirements",
    prepBullet3: "Preparing pricing options",
    almostReady: "Almost ready...",
    estimateReady: "Please Choose A Brand",
    recommendedSystem: "Recommended System",
    priceRangeDesc: "This range is based on your home details, current AC setup, and standard replacement requirements.",
    chooseBrandFamily: "Choose Brand Family",
    viewDetails: "View Estimate Details",
    chooseFamilyTitle: "Choose Your Brand Family",
    chooseFamilyDesc: "Choose the Brand Family you would like to compare first. You can review other groups later.",
    budgetFriendly: "Budget-Friendly", budgetFriendlySub: "Reliable options designed to keep replacement costs practical.",
    commonlyPurchased: "Commonly Purchased", commonlyPurchasedSub: "Commonly selected brands with a strong balance of price, features, and availability.",
    trending: "Trending in 2026", trendingSub: "Side-discharge systems — higher efficiency, quieter, and slimmer.",
    premiumProducts: "Premium Products", premiumProductsSub: "Higher-end brand options with stronger features, efficiency choices, or warranty support.",
    chooseBrandTitle: "Choose Your Brand",
    chooseBrandDesc: "These brands are available in the group you selected. Choose the one you would like to see first.",
    showRecommended: "Show Recommended Brand",
    additionalBrands: "Additional Brand Options",
    ourRecommendation: "Our Recommendation",
    recommendationTitle: "Your System Recommendations",
    bestValue: "Best Value", bestEfficiency: "Best Efficiency",
    seer2Label: "SEER2", tonsLabel: "Tons", priceLabel: "Installed Price",
    saveOption: "Save This Option", saved: "Saved", savedOptions: "Review Saved Options",
    scheduleThis: "Schedule Installation of This System",
    viewFullDetails: "See Full Details & What's Included",
    returnSaved: "Return to Saved Options",
    seeMore: "See More Options",
    guarantee45: "45-Day Price Guarantee",
    guarantee45Desc: "This price is guaranteed for 45 days from today.",
    qualityPledge: "Quality Pledge",
    energyStar: "ENERGY STAR® Certified",
    installation: "Installation Includes",
    installItems: ["Displayed System", "Concrete Pad", "New Copper Refrigerant Lines", "Hurricane Clips to Secure Unit", "Float Switch to Prevent Drain Backups", "UV Light", "2\" Filter Rack", "Labor", "Permits", "Old System Haul-Away"],
    partsWarranty: "10-Year Limited Parts Warranty",
    partsWarrantyNote: "Required by Florida Law",
    monthlyFrom: "As low as",
    perMonth: "/mo with financing",
    reviewTitle: "Review Your System Details",
    emailQuote: "Email This Quote",
    approveQuote: "Approve This Quote",
    reviewMore: "Review More Systems",
    personalTitle: "Almost There!",
    personalDesc: "To complete your quote and schedule your installation, we need a few details.",
    nameLabel: "Full Name", emailLabel: "Email Address", phoneLabel: "Phone Number",
    contactPref: "How would you like us to confirm your appointment?",
    prefText: "Text Message", prefVoice: "Phone Call", prefBoth: "Both (Preferred)",
    continueToPayment: "Continue to Payment Options",
    continueToSchedule: "Continue to Schedule My Installation",
    saveProgress: "Save My Progress",
    savedTitle: "Progress Saved!",
    savedDesc: "We've sent a link to your email. Click it anytime to resume your estimate on any device.",
    paymentTitle: "Choose How You'd Like to Pay",
    paymentDesc: "A 50% deposit secures your installation date. Financing through FTL requires no deposit today.",
    payCard: "Pay by Card", payCardSub: "Instant - secured by Stripe",
    payACH: "Pay by Bank Transfer (ACH)", payACHSub: "No card fees - 1-3 day verification",
    payFTL: "Apply for Financing (FTL)", payFTLSub: "Traditional credit-based financing - own your system from day one",
    payMicrof: "Lease-to-Own (Microf)", payMicrofSub: "Flexible approval - lease today, own it later",
    microfBridgeTitle: "Lease-to-Own with Microf",
    microfBridgeDesc: "You'll complete a quick application on Microf's secure site. Approval is flexible and doesn't require perfect credit. No deposit required while your application is reviewed.",
    microfContinue: "Continue to Microf Application",
    payAffirm: "Pay Over Time with Affirm", payAffirmSub: "Instant approval - flexible monthly plans",
    depositDue: "Deposit Due Today", noDepositDue: "No Deposit Due Today",
    cardFormTitle: "Enter Card Details",
    cardNumber: "Card Number", cardExpiry: "MM/YY", cardCvc: "CVC", cardZip: "Billing ZIP",
    payNow: "Pay Deposit Now",
    achFormTitle: "Enter Bank Account Details",
    achRouting: "Routing Number", achAccount: "Account Number", achAccountType: "Account Type",
    achChecking: "Checking", achSavings: "Savings",
    achSubmit: "Submit Bank Payment",
    ftlBridgeTitle: "You're About to Apply for Financing",
    ftlBridgeDesc: "You'll complete your application on FTL's secure site - it takes about 5 minutes. No deposit is required while your application is reviewed.",
    ftlContinue: "Continue to FTL Application",
    affirmBridgeTitle: "Pay Over Time with Affirm",
    affirmBridgeDesc: "See your monthly payment options instantly. No impact to your credit score to check.",
    affirmContinue: "Continue to Affirm",
    processingPayment: "Processing your payment...",
    paymentSuccess: "Payment Confirmed!",
    calendarTitle: "Choose Your Installation Date",
    calendarDesc: "Select an available date below. Your spot is reserved the moment you choose it.",
    noSlotsAvailable: "No available dates this month",
    nextMonth: "Next Month", prevMonth: "Previous Month",
    confirmDate: "Confirm This Date",
    confirmationTitle: "You're All Set!",
    confirmationDesc: "Your installation is scheduled. We've sent a confirmation to your email and phone.",
    bookingRef: "Booking Reference",
    installDate: "Installation Date",
    whatNext: "What Happens Next",
    nextStep1: "You'll receive an email and text confirmation within minutes",
    nextStep2: "Our team will call you within 1 business day to confirm details",
    nextStep3: "Our technicians will arrive on your scheduled date, ready to install",
    backToHome: "Return to Home",
    cardDeclined: "Your card was declined. Please try a different payment method.",
    achPending: "Your bank payment is being verified. This typically takes 1-3 business days.",
    slotHeld: "Your slot is held for",
    hours: "hours", minutes: "minutes",
    notSureShort: "I'm not sure",
    cgTitle: "Comfort Guide", cgPlaceholder: "Ask me anything...", cgSend: "Send", cgThinking: "Thinking...",
    cgWelcome: "Hi! I'm your Comfort Guide. I can help you understand your options, explain equipment differences, or answer any questions about the process. What's on your mind?",
    noApptShortTwo: "No appointment required", noCallShortTwo: "No salesperson will call",
  },
  es: {
    taglineH: "Vea Cuánto Podría Costar un Nuevo Sistema de Confort para Su Hogar",
    startBtn: "Comenzar Mi Estimado", whyDiff: "¿Por Qué Esta App Es Diferente?",
    gotIt: "Entendido", noAppt: "No se requiere cita.", noCall: "No se requiere llamada de ventas.", noCommit: "Sin compromiso.",
    whyTitle: "¿Por Qué Esta App Es Diferente?",
    whyP1: "Aire Azul le da una forma privada y sin presión de explorar opciones de reemplazo de AC.",
    whyP2: "Ningún vendedor le llamará. No se requiere cita. No se necesita compromiso.",
    whyP3: "Responda algunas preguntas, revise opciones y pida ayuda a su Guía de Confort.",
    findHome: "Encontremos Su Hogar",
    findHomeDesc: "Ingrese la dirección de instalación para estimar los detalles de su hogar.",
    addressLabel: "DIRECCIÓN DE INSTALACIÓN", addressPlaceholder: "Comience a escribir su dirección...",
    findBtn: "Encontrar Mi Hogar", noApptShort: "No se requiere cita", noCallShort: "Ningún vendedor llamará",
    comfortGuide: "¿Necesita ayuda? Pregunte a su Guía de Confort.",
    foundHome: "Encontramos Su Hogar",
    confirmDesc: "Por favor confirme estos detalles para que su estimado sea correcto.",
    confirmBtn: "Sí, Esto Se Ve Bien", editBtn: "Editar Detalles",
    beds: "Habs", baths: "Baños", sqft: "Pie²", builtIn: "Construido en",
    whatEstimate: "¿Qué Le Gustaría Estimar?",
    replaceMain: "Reemplazar el sistema de AC principal", replaceMainSub: "Ideal para reemplazar su sistema central actual.",
    addRoom: "Agregar confort a una habitación", addRoomSub: "Ideal para dormitorios, garajes o habitaciones problemáticas.",
    notSure: "No estoy seguro — guíeme", notSureSub: "Le indicaremos la dirección correcta.",
    coolWell: "¿Su AC Actual Ha Estado Enfriando Adecuadamente?",
    coolWellDesc: "Esto nos ayuda a estimar si el tamaño de su sistema actual ha podido mantener el confort.",
    coolYes: "Sí, enfría bien el hogar", coolUsed: "No, antes enfriaba bien",
    coolStruggle: "No, siempre ha tenido problemas", coolNotSure: "No estoy seguro",
    floodZone: "¿Está Su Hogar en una Zona de Inundación?",
    floodDesc: "Los hogares en zonas de inundación pueden requerir que el equipo sea elevado.",
    floodYes: "Sí, mi hogar está en una zona de inundación", floodNo: "No, mi hogar no está en una zona de inundación",
    systemAge: "¿Qué Tan Viejo Es Su AC?",
    systemAgeDesc: "La edad de su AC nos ayuda a estimar si las líneas de refrigerante necesitan reemplazo.",
    ageNew: "Menos de 15 años", ageOld: "Más de 15 años",
    hoaTitle: "¿Una HOA o Oficina Comunitaria Aprueba el Trabajo de AC?",
    hoaDesc: "Algunos vecindarios y comunidades tienen reglas sobre equipos de AC exteriores.",
    hoaYes: "Sí", hoaNo: "No",
    systemTypeTitle: "Veamos Su Sistema de AC y Calefacción Actual",
    sysElectric: "Es todo Eléctrico, parte Interior y parte Exterior",
    sysElectricSub: "Esto es un Sistema Dividido de Bomba de Calor",
    sysPackage: "Es una Unidad de Paquete — Todo Afuera",
    sysPackageSub: "Común en casas móviles y prefabricadas",
    sysGas: "Es un Sistema de Horno de Gas y Aire Acondicionado",
    sysGasSub: "Tiene horno de gas interior y unidad de AC exterior",
    preparing: "Determinando Sus Requisitos del Sistema...",
    preparingDesc: "Estamos usando los detalles de su hogar para crear un estimado de reemplazo realista.",
    prepBullet1: "Combinando con su configuración actual",
    prepBullet2: "Verificando requisitos de instalación",
    prepBullet3: "Preparando opciones de precios",
    almostReady: "Casi listo...",
    estimateReady: "Por Favor Elija Una Marca",
    recommendedSystem: "Sistema Recomendado",
    priceRangeDesc: "Este rango se basa en los detalles de su hogar y los requisitos estándar de reemplazo.",
    chooseBrandFamily: "Elegir Familia de Marca",
    viewDetails: "Ver Detalles del Estimado",
    chooseFamilyTitle: "Elija Su Familia de Marca",
    chooseFamilyDesc: "Elija la Familia de Marca que desea comparar primero. Puede revisar otros grupos después.",
    budgetFriendly: "Económico", budgetFriendlySub: "Opciones confiables para mantener los costos de reemplazo prácticos.",
    commonlyPurchased: "Más Comprados", commonlyPurchasedSub: "Marcas comúnmente seleccionadas con un buen balance de precio y características.",
    trending: "Tendencia en 2026", trendingSub: "Sistemas de descarga lateral — más eficientes, silenciosos y compactos.",
    premiumProducts: "Productos Premium", premiumProductsSub: "Opciones de marca de alta gama con mejores características y garantía.",
    chooseBrandTitle: "Elija Su Marca",
    chooseBrandDesc: "Estas marcas están disponibles en el grupo seleccionado.",
    showRecommended: "Mostrar Marca Recomendada",
    additionalBrands: "Opciones de Marcas Adicionales",
    ourRecommendation: "Nuestra Recomendación",
    recommendationTitle: "Sus Recomendaciones de Sistema",
    bestValue: "Mejor Valor", bestEfficiency: "Mejor Eficiencia",
    seer2Label: "SEER2", tonsLabel: "Toneladas", priceLabel: "Precio Instalado",
    saveOption: "Guardar Esta Opción", saved: "Guardado", savedOptions: "Revisar Opciones Guardadas",
    scheduleThis: "Programar Instalación de Este Sistema",
    viewFullDetails: "Ver Detalles Completos y Lo Que Incluye",
    returnSaved: "Volver a Opciones Guardadas",
    seeMore: "Ver Más Opciones",
    guarantee45: "Garantía de Precio 45 Días",
    guarantee45Desc: "Este precio está garantizado por 45 días a partir de hoy.",
    qualityPledge: "Garantía de Calidad",
    energyStar: "Certificado ENERGY STAR®",
    installation: "La Instalación Incluye",
    installItems: ["Sistema Mostrado", "Plataforma de Concreto", "Líneas de Refrigerante de Cobre Nuevas", "Clips de Huracán", "Interruptor Flotante", "Luz UV", "Bastidor de Filtro 2\"", "Mano de Obra", "Permisos", "Retiro del Sistema Antiguo"],
    partsWarranty: "Garantía de Partes 10 Años",
    partsWarrantyNote: "Requerido por la Ley de Florida",
    monthlyFrom: "Desde",
    perMonth: "/mes con financiamiento",
    reviewTitle: "Revise los Detalles de Su Sistema",
    emailQuote: "Enviar Cotización por Email",
    approveQuote: "Aprobar Esta Cotización",
    reviewMore: "Revisar Más Sistemas",
    personalTitle: "¡Casi Listo!",
    personalDesc: "Para completar su cotización y programar su instalación, necesitamos algunos datos.",
    nameLabel: "Nombre Completo", emailLabel: "Correo Electrónico", phoneLabel: "Número de Teléfono",
    contactPref: "¿Cómo le gustaría que confirmemos su cita?",
    prefText: "Mensaje de Texto", prefVoice: "Llamada Telefónica", prefBoth: "Ambos (Preferido)",
    continueToPayment: "Continuar a Opciones de Pago",
    continueToSchedule: "Continuar a Programar Mi Instalación",
    saveProgress: "Guardar Mi Progreso",
    savedTitle: "¡Progreso Guardado!",
    savedDesc: "Le hemos enviado un enlace a su correo. Haga clic en cualquier momento para continuar.",
    paymentTitle: "Elija Cómo Le Gustaría Pagar",
    paymentDesc: "Un depósito del 50% asegura su fecha de instalación. El financiamiento FTL no requiere depósito hoy.",
    payCard: "Pagar con Tarjeta", payCardSub: "Instantáneo - asegurado por Stripe",
    payACH: "Pagar por Transferencia Bancaria (ACH)", payACHSub: "Sin cargos de tarjeta - verificación de 1-3 días",
    payFTL: "Solicitar Financiamiento (FTL)", payFTLSub: "Financiamiento tradicional basado en crédito - sea dueño de su sistema desde el primer día",
    payMicrof: "Arrendamiento con Opción a Compra (Microf)", payMicrofSub: "Aprobación flexible - arriende hoy, sea dueño después",
    microfBridgeTitle: "Arrendamiento con Opción a Compra con Microf",
    microfBridgeDesc: "Completará una solicitud rápida en el sitio seguro de Microf. La aprobación es flexible y no requiere crédito perfecto. No se requiere depósito mientras se revisa su solicitud.",
    microfContinue: "Continuar a la Solicitud de Microf",
    payAffirm: "Pagar con el Tiempo con Affirm", payAffirmSub: "Aprobación instantánea - planes mensuales flexibles",
    depositDue: "Depósito Debido Hoy", noDepositDue: "Sin Depósito Hoy",
    cardFormTitle: "Ingrese los Detalles de la Tarjeta",
    cardNumber: "Número de Tarjeta", cardExpiry: "MM/AA", cardCvc: "CVC", cardZip: "Código Postal",
    payNow: "Pagar Depósito Ahora",
    achFormTitle: "Ingrese los Detalles de la Cuenta Bancaria",
    achRouting: "Número de Ruta", achAccount: "Número de Cuenta", achAccountType: "Tipo de Cuenta",
    achChecking: "Cuenta de Cheques", achSavings: "Cuenta de Ahorros",
    achSubmit: "Enviar Pago Bancario",
    ftlBridgeTitle: "Está a Punto de Solicitar Financiamiento",
    ftlBridgeDesc: "Completará su solicitud en el sitio seguro de FTL - toma unos 5 minutos. No se requiere depósito mientras se revisa su solicitud.",
    ftlContinue: "Continuar a la Solicitud de FTL",
    affirmBridgeTitle: "Pague con el Tiempo con Affirm",
    affirmBridgeDesc: "Vea sus opciones de pago mensual al instante. Sin impacto en su puntaje de crédito al consultar.",
    affirmContinue: "Continuar a Affirm",
    processingPayment: "Procesando su pago...",
    paymentSuccess: "¡Pago Confirmado!",
    calendarTitle: "Elija Su Fecha de Instalación",
    calendarDesc: "Seleccione una fecha disponible abajo. Su lugar se reserva en el momento que lo eliga.",
    noSlotsAvailable: "No hay fechas disponibles este mes",
    nextMonth: "Mes Siguiente", prevMonth: "Mes Anterior",
    confirmDate: "Confirmar Esta Fecha",
    confirmationTitle: "¡Todo Listo!",
    confirmationDesc: "Su instalación está programada. Hemos enviado una confirmación a su correo y teléfono.",
    bookingRef: "Referencia de Reserva",
    installDate: "Fecha de Instalación",
    whatNext: "Qué Sigue",
    nextStep1: "Recibirá una confirmación por correo y mensaje de texto en minutos",
    nextStep2: "Nuestro equipo le llamará dentro de 1 día hábil para confirmar los detalles",
    nextStep3: "Nuestros técnicos llegarán en su fecha programada, listos para instalar",
    backToHome: "Volver al Inicio",
    cardDeclined: "Su tarjeta fue rechazada. Por favor intente otro método de pago.",
    achPending: "Su pago bancario está siendo verificado. Esto generalmente toma 1-3 días hábiles.",
    slotHeld: "Su lugar está reservado por",
    hours: "horas", minutes: "minutos",
    notSureShort: "No estoy seguro",
    cgTitle: "Guía de Confort", cgPlaceholder: "Pregúnteme cualquier cosa...", cgSend: "Enviar", cgThinking: "Pensando...",
    cgWelcome: "¡Hola! Soy su Guía de Confort. Puedo ayudarle con sus opciones y responder preguntas. ¿En qué puedo ayudarle?",
    noApptShortTwo: "No se requiere cita", noCallShortTwo: "Ningún vendedor llamará",
  },
};

const MOCK_PROPERTY = { beds: 2, baths: 2, sqft: 1144, type: "Manufactured Home", year: 2012, address: "15 Teak Rd, Ocala, FL 34472" };

// ── SUPABASE CLIENT ───────────────────────────────────────────────────────────
const sb = {
  get: async (table, params = "") => {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return r.json();
  },
  post: async (table, data) => {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(data)
    });
    return r.json();
  }
};

// ── QUOTING ENGINE ────────────────────────────────────────────────────────────
const QuoteEngine = {
  // Calculate all price adders based on answers
  // Fetch live adder prices from Supabase (cached for the session to avoid repeat fetches)
  _addersCache: null,
  fetchAllAdders: async () => {
    if (QuoteEngine._addersCache) return QuoteEngine._addersCache;
    try {
      // Price adders are edited in Journey → Estimate App Setup and arrive with the catalog;
      // the app's own table is only a fallback.
      let data = [];
      try { const cat = await Catalog.load(); if (Array.isArray(cat.qualifiers) && cat.qualifiers.length) data = cat.qualifiers; } catch (e) {}
      if (!data.length) data = await sb.get("job_qualifiers", "active=eq.true&select=*");
      const map = {};
      (Array.isArray(data) ? data : []).forEach(a => { map[a.qualifier_key] = a; });
      QuoteEngine._addersCache = map;
      return map;
    } catch(e) {
      console.error("Failed to fetch adders:", e);
      return {};
    }
  },

  // Calculate which adders apply based on answers, using LIVE prices from Supabase.
  // Business rules (which answer triggers which adder key) stay here in code,
  // but the actual dollar amounts come from the database so Lloyd can edit them himself.
  calcAdders: async (answers) => {
    const adderMap = await QuoteEngine.fetchAllAdders();
    let total = 0;
    const applied = [];

    const apply = (key) => {
      const a = adderMap[key];
      if (a) { total += parseFloat(a.price_adder) || 0; applied.push({ key, label: a.qualifier_label, amount: parseFloat(a.price_adder) || 0, visible: a.customer_visible }); }
    };

    if (answers.floodZone === "yes") apply("flood_zone");
    if (answers.systemAge === "new") apply("system_age_new");
    if (answers.systemAge === "old") apply("system_age_old");
    if (answers.hoa === "yes") apply("hoa_approval");
    if (answers.ahuStandCondition === "poor") apply("ahu_stand_rebuild");
    if (answers.buildingFloor === "second") apply("second_floor_lineset");
    if (answers.rooftopCrane) apply("rooftop_crane");
    if (answers.installLocation) apply(`install_${answers.installLocation}`);
    if (answers.ductReplacement === "yes") {
      if (answers.homeWidth === "single") apply("duct_replacement_single");
      if (answers.homeWidth === "double") apply("duct_replacement_double");
      if (answers.homeWidth === "triple") apply("duct_replacement_triple");
    }

    return { total, applied };
  },

};

// ── STRIPE.JS LOADER ──────────────────────────────────────────────────────────
let stripeInstance = null;
let stripeLoading = false;
let stripeCallbacks = [];

function loadStripe(callback) {
  if (stripeInstance) { callback(stripeInstance); return; }
  stripeCallbacks.push(callback);
  if (stripeLoading) return;
  stripeLoading = true;

  const initStripe = () => {
    if (window.Stripe) {
      stripeInstance = window.Stripe(STRIPE_PUBLISHABLE_KEY);
      stripeCallbacks.forEach(cb => cb(stripeInstance));
      stripeCallbacks = [];
    }
  };

  if (window.Stripe) {
    initStripe();
    return;
  }

  if (!document.getElementById("stripe-js")) {
    const script = document.createElement("script");
    script.id = "stripe-js";
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    script.onload = initStripe;
    document.head.appendChild(script);
  }
}

// ── GOOGLE FONTS ──────────────────────────────────────────────────────────────
function FontLoader() {
  useEffect(() => {
    if (!document.getElementById("nunito-font")) {
      const l = document.createElement("link");
      l.id = "nunito-font";
      l.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap";
      l.rel = "stylesheet";
      document.head.appendChild(l);
    }
  }, []);
  return null;
}

// ── SHIELD LOGO ───────────────────────────────────────────────────────────────
function ShieldLogo({ brand, size = 48 }) {
  const scale = size / 100;
  return (
    <svg viewBox="0 0 320 100" width={320 * scale} height={100 * scale} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00B0F0" />
          <stop offset="100%" stopColor="#163E64" />
        </linearGradient>
        <filter id="ds"><feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.25)" /></filter>
      </defs>
      <g filter="url(#ds)">
        <path d="M50 6 L84 6 Q91 6 91 13 L91 46 Q91 67 70 78 L50 78 Q29 67 29 46 L29 13 Q29 6 36 6 Z" fill="url(#sg)" />
        <path d="M50 6 L84 6 Q91 6 91 13 L91 46 Q91 67 70 78 L50 78 Q29 67 29 46 L29 13 Q29 6 36 6 Z" fill="none" stroke="#fff" strokeWidth="2" />
      </g>
      {[0,90,45,135].map(a => {
        const r = a * Math.PI / 180, cx = 60, cy = 42, len = 14;
        return <line key={a} x1={cx-Math.cos(r)*len} y1={cy-Math.sin(r)*len} x2={cx+Math.cos(r)*len} y2={cy+Math.sin(r)*len} stroke="white" strokeWidth="2.5" strokeLinecap="round"/>;
      })}
      <circle cx="60" cy="42" r="3" fill="white" />
      <text x="100" y="36" fontFamily="'Nunito',sans-serif" fontWeight="900" fontSize="26" fill="#163E64">{brand.name.split(" ")[0]}</text>
      <text x="100" y="63" fontFamily="'Nunito',sans-serif" fontWeight="900" fontSize="26" fill="#00B0F0">{brand.name.split(" ").slice(1).join(" ")}</text>
      <text x="100" y="78" fontFamily="'Nunito',sans-serif" fontWeight="600" fontSize="8" fill="#163E64" letterSpacing="1.2">{brand.tagline}</text>
    </svg>
  );
}

// ── SHARED UI ─────────────────────────────────────────────────────────────────
function BlueBtn({ children, onClick, disabled, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "#a0d4f0" : C.blue, color: C.white,
      border: `2px solid ${C.white}`, borderRadius: 50, padding: "15px 24px",
      fontSize: 16, fontWeight: 800, cursor: disabled ? "not-allowed" : "pointer",
      width: "100%", textAlign: "center", boxShadow: disabled ? "none" : SHADOW,
      fontFamily: FONT, transition: "transform 0.15s", ...style,
    }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
    >{children}</button>
  );
}

function WhiteBtn({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      background: C.white, color: C.blue, border: `2px solid ${C.blue}`,
      borderRadius: 50, padding: "15px 24px", fontSize: 16, fontWeight: 800,
      cursor: "pointer", width: "100%", textAlign: "center", boxShadow: SHADOW,
      fontFamily: FONT, transition: "transform 0.15s, background 0.15s", ...style,
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "#f0faff"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = C.white; e.currentTarget.style.transform = ""; }}
    >{children}</button>
  );
}

function NavyBtn({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      background: C.navy, color: C.white, border: `2px solid ${C.white}`,
      borderRadius: 50, padding: "15px 24px", fontSize: 16, fontWeight: 800,
      cursor: "pointer", width: "100%", textAlign: "center", boxShadow: SHADOW,
      fontFamily: FONT, transition: "transform 0.15s", ...style,
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
      onMouseLeave={e => e.currentTarget.style.transform = ""}
    >{children}</button>
  );
}

function Check({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13, color: C.navy, fontWeight: 700 }}>
      <span style={{ color: C.blue, fontWeight: 900 }}>✓</span>{text}
    </div>
  );
}

function TrustRow({ items }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "center" }}>{items.map(t => <Check key={t} text={t} />)}</div>;
}

function CGBar({ t, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: C.white, border: `2px solid ${C.blue}`, borderRadius: 50,
      padding: "12px 20px", display: "flex", alignItems: "center",
      justifyContent: "center", gap: 10, cursor: "pointer", width: "100%",
      fontSize: 14, fontWeight: 700, color: C.navy, fontFamily: FONT,
      boxShadow: SHADOW_SM, transition: "transform 0.15s",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
      onMouseLeave={e => e.currentTarget.style.transform = ""}
    ><span style={{ fontSize: 20 }}>🧑‍💼</span><span>{t.comfortGuide}</span></button>
  );
}

function HeroCard({ emoji, overlayText, children, imgSrc }) {
  return (
    <div style={{ margin: "12px 20px 0", borderRadius: 20, overflow: "hidden", boxShadow: SHADOW }}>
      <div style={{ height: 185, position: "relative", background: "linear-gradient(160deg,#00B0F0 0%,#163E64 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {imgSrc ? <img src={imgSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 80 }}>{emoji}</span>}
        {overlayText && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(22,62,100,0.82)", padding: "10px 16px", textAlign: "center" }}>
            <p style={{ margin: 0, color: C.white, fontWeight: 700, fontSize: 14, lineHeight: 1.5 }}>{overlayText}</p>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function Shell({ children, t, brand, onCG, showBack, onBack, showSave, onSave, onStartOver }) {
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: FONT, maxWidth: 430, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "14px 20px 0" }}>
        {showBack
          ? <button onClick={onBack} style={{ background: C.white, border: `2px solid ${C.blue}`, borderRadius: "50%", width: 36, height: 36, color: C.blue, fontWeight: 900, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SHADOW_SM, flexShrink: 0 }}>←</button>
          : <div style={{ width: 36 }} />}
        <div style={{ flex: 1, textAlign: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: C.blue, letterSpacing: 2, textTransform: "uppercase" }}>{brand.name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {showSave && <button onClick={onSave} style={{ background: "none", border: "none", color: C.blue, fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap" }}>💾 Save</button>}
          {onStartOver && (
            <button onClick={() => setConfirmingReset(true)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap" }}>
              ↺ Start Over
            </button>
          )}
        </div>
      </div>

      {confirmingReset && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(22,62,100,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setConfirmingReset(false)}>
          <div style={{ background: C.white, borderRadius: 20, padding: 24, maxWidth: 320, boxShadow: "10px 10px 30px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 36, textAlign: "center", marginBottom: 8 }}>↺</div>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: C.navy, textAlign: "center", margin: "0 0 8px" }}>Start Over?</h3>
            <p style={{ fontSize: 13, color: "#64748b", textAlign: "center", marginBottom: 18, lineHeight: 1.5 }}>
              This clears your current progress so you can begin a fresh estimate — useful if your needs have changed, or you'd like a new property address.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <WhiteBtn onClick={() => setConfirmingReset(false)} style={{ flex: 1, padding: "10px", fontSize: 13 }}>Cancel</WhiteBtn>
              <BlueBtn onClick={() => { setConfirmingReset(false); onStartOver(); }} style={{ flex: 1, padding: "10px", fontSize: 13 }}>Start Over</BlueBtn>
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>{children}</div>
      <div style={{ padding: "10px 20px 24px" }}><CGBar t={t} onClick={onCG} /></div>
    </div>
  );
}

// Price badge
function PriceBadge({ price, adders, t }) {
  const total = (price || 0) + (adders || 0);
  const deposit = total * 0.5;
  const monthly = Math.round(total / 60);
  return (
    <div style={{ background: C.white, borderRadius: 16, padding: "16px", margin: "8px 0", boxShadow: SHADOW_SM, border: `2px solid ${C.blue}` }}>
      <div style={{ fontSize: 28, fontWeight: 900, color: C.navy, textAlign: "center" }}>
        ${total.toLocaleString()}
      </div>
      <div style={{ fontSize: 12, color: C.blue, fontWeight: 700, textAlign: "center" }}>
        {t.monthlyFrom} ${monthly}{t.perMonth}
      </div>
      <div style={{ fontSize: 11, color: "#64748b", textAlign: "center", marginTop: 4 }}>
        50% deposit: ${deposit.toLocaleString()}
      </div>
    </div>
  );
}

// Guarantee badge
function GuaranteeBadge({ t }) {
  const expires = new Date();
  expires.setDate(expires.getDate() + 45);
  return (
    <div style={{ background: C.navy, borderRadius: 12, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, margin: "8px 0" }}>
      <span style={{ fontSize: 24 }}>🛡️</span>
      <div>
        <div style={{ color: C.white, fontWeight: 900, fontSize: 13 }}>{t.guarantee45}</div>
        <div style={{ color: C.gray, fontSize: 11 }}>Expires {expires.toLocaleDateString()}</div>
      </div>
    </div>
  );
}

// Equipment card
function EquipmentCard({ eq, adders, t, onSave, onSelect, saved, recommended, label }) {
  const total = (eq.installation_price || 0) + adders;
  const monthly = Math.round(total / 60);
  return (
    <div style={{
      background: C.white, borderRadius: 16, padding: "16px", marginBottom: 12,
      boxShadow: SHADOW, border: recommended ? `3px solid ${C.blue}` : `1.5px solid ${C.gray}`,
    }}>
      {recommended && (
        <div style={{ background: C.blue, color: C.white, borderRadius: 8, padding: "4px 12px", fontSize: 11, fontWeight: 900, display: "inline-block", marginBottom: 8 }}>
          ⭐ {label || t.ourRecommendation}
        </div>
      )}
      <div style={{ fontWeight: 900, fontSize: 15, color: C.navy, marginBottom: 4 }}>
        {eq.outdoor_brand} {eq.outdoor_series}
      </div>
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
        {eq.size_tons} Ton · SEER2 {eq.seer2} · {eq.system_type}
      </div>
      {eq.energy_star && <span style={{ background: "#dcfce7", color: C.green, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, marginRight: 6 }}>⚡ ENERGY STAR®</span>}
      {eq.quality_pledge && (
        <span style={{ background: "#fef9c3", color: "#92400e", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
          🛡️ {eq.quality_pledge_years === 999 ? "Lifetime" : `${eq.quality_pledge_years}-Year`} Quality Pledge
        </span>
      )}
      <div style={{ margin: "10px 0 4px", fontSize: 24, fontWeight: 900, color: C.navy }}>${total.toLocaleString()}</div>
      <div style={{ fontSize: 11, color: C.blue, fontWeight: 700, marginBottom: 10 }}>
        {t.monthlyFrom} ${monthly}{t.perMonth}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <BlueBtn onClick={() => onSelect(eq)} style={{ flex: 2, padding: "11px 16px", fontSize: 13 }}>
          {t.viewFullDetails}
        </BlueBtn>
        <WhiteBtn onClick={() => onSave(eq)} style={{ flex: 1, padding: "11px 12px", fontSize: 12, opacity: saved ? 0.5 : 1 }}>
          {saved ? `✓ ${t.saved}` : t.saveOption}
        </WhiteBtn>
      </div>
    </div>
  );
}

// ── COMFORT GUIDE: CONTEXT BUILDER ────────────────────────────────────────────
// Builds a rich, current snapshot of where the customer is in their journey
// so Comfort Guide can give genuinely relevant, grounded answers
// ── SHARED EMAIL TEMPLATE ──────────────────────────────────────────────────────
// Builds a polished, branded HTML quote email used by both Comfort Guide
// and the Screen 15 "Email This Quote" button — single source of truth.
function buildQuoteEmailHtml({ lang, brandName, customerName, address, eq, total, monthly, deposit, lines, warranties, rooftop, links, booked, logoUrl }) {
  const isEs = lang === "es";
  const accent = "#00B0F0";
  const navy = "#163E64";

  const greeting = isEs ? `Hola${customerName ? " " + customerName : ""},` : `Hi${customerName ? " " + customerName : ""},`;
  const intro = isEs
    ? `Aquí está el resumen completo de su cotización${address ? " para " + address : ""}:`
    : `Here's the complete summary of your quote${address ? " for " + address : ""}:`;
  const guaranteeText = isEs
    ? "Este precio está garantizado por 45 días — sin sorpresas, sin presión."
    : "This price is guaranteed for 45 days — no surprises, no pressure.";
  const monthlyLabel = isEs ? "Desde" : "As low as";
  const depositLabel = isEs ? "Depósito del 50% al programar" : "50% deposit at scheduling";
  const ctaText = isEs ? "Continuar Mi Estimado" : "Continue My Estimate";
  const footerTagline = isEs ? "Siempre Conectados. Siempre Cómodos." : "Always Connected. Always Comfortable.";
  const specsHeading = isEs ? "Especificaciones del Sistema" : "System Specifications";
  const includesHeading = isEs ? "La Instalación Incluye" : "Installation Includes";
  const partsWarrantyText = isEs ? "Garantía de Partes Limitada de 10 Años" : "10-Year Limited Parts Warranty";
  const partsWarrantyNote = isEs ? "Requerido por la Ley de Florida" : "Required by Florida Law";

  const installItems = isEs
    ? ["Sistema Mostrado", "Plataforma de Concreto", "Líneas de Refrigerante de Cobre Nuevas", "Clips de Huracán", "Interruptor Flotante", "Luz UV", "Bastidor de Filtro 2\"", "Mano de Obra", "Permisos", "Retiro del Sistema Antiguo"]
    : ["Displayed System", "Concrete Pad", "New Copper Refrigerant Lines", "Hurricane Clips to Secure Unit", "Float Switch to Prevent Drain Backups", "UV Light", "2\" Filter Rack", "Labor", "Permits", "Old System Haul-Away"];

  // When the caller passes the quote's own lines (from the pricebook + "Installation includes"),
  // the email shows exactly what the customer saw on screen.
  const useLines = Array.isArray(lines) && lines.length > 0;
  const specRows = eq && !useLines ? [
    [isEs ? "Marca y Serie" : "Brand & Series", `${eq.outdoor_brand || ""} ${eq.outdoor_series || ""}`.trim()],
    eq.ahri_ref ? [isEs ? "Referencia AHRI" : "AHRI Reference", eq.ahri_ref] : null,
    eq.outdoor_model ? [isEs ? "Unidad Exterior" : "Outdoor Unit", eq.outdoor_model] : null,
    eq.indoor_model ? [isEs ? "Unidad Interior" : "Indoor Unit", eq.indoor_model] : null,
    eq.furnace_model ? [isEs ? "Horno" : "Furnace", eq.furnace_model] : null,
    [isEs ? "Tamaño del Sistema" : "System Size", `${eq.size_tons || ""} ${isEs ? "Toneladas" : "Tons"}`],
    ["SEER2", eq.seer2 || ""],
    eq.cooling_capacity ? [isEs ? "Capacidad de Enfriamiento" : "Cooling Capacity", `${eq.cooling_capacity.toLocaleString()} BTU/h`] : null,
    eq.labor_warranty ? [isEs ? "Garantía de Mano de Obra" : "Labor Warranty", eq.labor_warranty] : null,
  ].filter(Boolean) : [];

  const specRowsHtml = specRows.map(([label, val], i) => `
    <tr><td style="padding:7px 0; color:#64748b; font-size:13px; ${i > 0 ? "border-top:1px solid #e2e8f0;" : ""}">${label}</td><td style="padding:7px 0; text-align:right; font-weight:700; color:${navy}; font-size:13px; ${i > 0 ? "border-top:1px solid #e2e8f0;" : ""}">${val}</td></tr>
  `).join("");

  // Badges row (Energy Star + Quality Pledge)
  const badgesHtml = eq ? `
    <div style="margin: 12px 0;">
      ${eq.energy_star ? `<span style="display:inline-block; background:#dcfce7; color:#16a34a; border-radius:6px; padding:4px 10px; font-size:11px; font-weight:700; margin-right:6px; margin-bottom:6px;">${isEs ? "Certificado ENERGY STAR®" : "ENERGY STAR® Certified"}</span>` : ""}
      ${eq.quality_pledge ? `<span style="display:inline-block; background:#fef9c3; color:#92400e; border-radius:6px; padding:4px 10px; font-size:11px; font-weight:700; margin-bottom:6px;">${eq.quality_pledge_years === 999 ? (isEs ? "Garantía de Por Vida" : "Lifetime") : eq.quality_pledge_years + "-" + (isEs ? "Año" : "Year")} Quality Pledge</span>` : ""}
    </div>
  ` : "";

  // Full Quality Pledge explanation block, matching Screen 15 exactly
  const qualityPledgeBlock = (eq && eq.quality_pledge) ? `
    <table style="width:100%; background:#fefce8; border:1px solid #fde68a; border-radius:10px; margin-bottom: 16px;" cellpadding="0" cellspacing="0">
      <tr><td style="padding:12px 14px;">
        <div style="font-weight:800; font-size:12px; color:#92400e; margin-bottom:5px;">
          ${eq.quality_pledge_years === 999 ? (isEs ? "Garantía de Por Vida" : "Lifetime") : eq.quality_pledge_years + "-" + (isEs ? "Año" : "Year")} Quality Pledge — ${isEs ? "Emitida por" : "Issued by"} ${eq.quality_pledge_issuer || ""}
        </div>
        <div style="font-size:11px; color:#78350f; line-height:1.5;">
          ${isEs
            ? "Si el compresor falla dentro del período cubierto, usted elige: un compresor de reemplazo nuevo, o el reemplazo completo de la unidad exterior. Sin costo para usted. Aplica a defectos de fabricación. Excluye abuso, negligencia o desastre natural. Se pueden solicitar registros de mantenimiento."
            : "If your compressor fails within the covered period, you choose: a brand new replacement compressor, or complete replacement of the entire outdoor unit. No cost to you. Applies to manufacturer defects. Excludes abuse, neglect, or natural disaster. Maintenance records may be requested."}
        </div>
      </td></tr>
    </table>
  ` : "";

  // Installation includes list
  const installItemsHtml = (useLines ? lines.slice(1) : installItems).map(item => `
    <tr><td style="padding:3px 0; font-size:12px; color:${navy}; font-weight:600;">✓ ${item}</td></tr>
  `).join("");

  return `
  <div style="font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; background:#CAEEFB; padding: 24px 16px;">
    <div style="background:#ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.08);">

      <!-- Header with shield logo -->
      <div style="background: linear-gradient(135deg, ${accent}, ${navy}); padding: 28px 24px; text-align: center;">
        <svg viewBox="0 0 100 100" width="56" height="56" style="display:block; margin: 0 auto 10px;">
          <path d="M50 6 L84 6 Q91 6 91 13 L91 46 Q91 67 70 78 L50 78 Q29 67 29 46 L29 13 Q29 6 36 6 Z" fill="rgba(255,255,255,0.15)" stroke="#ffffff" stroke-width="3"/>
          <line x1="50" y1="32" x2="50" y2="54" stroke="white" stroke-width="4" stroke-linecap="round"/>
          <line x1="39" y1="43" x2="61" y2="43" stroke="white" stroke-width="4" stroke-linecap="round"/>
          <line x1="42.5" y1="35.5" x2="57.5" y2="50.5" stroke="white" stroke-width="4" stroke-linecap="round"/>
          <line x1="57.5" y1="35.5" x2="42.5" y2="50.5" stroke="white" stroke-width="4" stroke-linecap="round"/>
          <circle cx="50" cy="43" r="4" fill="white"/>
        </svg>
        <div style="color: #ffffff; font-weight: 900; font-size: 20px; letter-spacing: 0.5px;">${brandName}</div>
      </div>

      <!-- Body -->
      <div style="padding: 28px 26px;">
        <p style="color:${navy}; font-size:15px; font-weight:700; margin: 0 0 6px;">${greeting}</p>
        <p style="color:#475569; font-size:14px; margin: 0 0 20px; line-height:1.5;">${intro}</p>

        <!-- Price card -->
        <table style="width:100%; background:#f0f9ff; border:2px solid ${accent}; border-radius:16px; margin-bottom: 18px;" cellpadding="0" cellspacing="0">
          <tr><td style="padding:20px; text-align:center;">
            <div style="font-size: 32px; font-weight: 900; color:${navy}; line-height:1;">$${total.toLocaleString()}</div>
            <div style="font-size: 13px; color:${accent}; font-weight:700; margin-top:4px;">${monthlyLabel} $${monthly}/mo</div>
            ${deposit ? `<div style="font-size: 12px; color:#64748b; margin-top:8px;">${depositLabel}: $${deposit.toLocaleString()}</div>` : ""}
          </td></tr>
        </table>

        ${eq ? `
        <div style="font-weight:900; font-size:14px; color:${navy}; margin-bottom: 8px;">${specsHeading}</div>
        <table style="width:100%; border-collapse:collapse; margin-bottom: 12px;">
          ${specRowsHtml}
        </table>
        ${badgesHtml}
        ` : ""}

        ${qualityPledgeBlock}

        ${useLines && logoUrl ? `<div style="text-align:center; margin: 4px 0 10px;"><img src="${logoUrl}" alt="${(eq && (eq.brandName || eq.outdoor_brand)) || ""}" style="max-width:220px; max-height:70px;"></div>` : ""}
        ${useLines ? `<div style="font-weight:900; font-size:15px; color:${navy}; margin-bottom: 10px;">${(eq && (eq.brandName || eq.outdoor_brand)) || ""} — ${lines[0]}</div>` : ""}

        <!-- Warranty -->
        ${(useLines && warranties && warranties.length ? warranties : [null]).map(w => `
        <table style="width:100%; background:${navy}; border-radius:12px; margin-bottom: 10px;" cellpadding="0" cellspacing="0">
          <tr><td style="padding:12px 16px;">
            <div style="color:#ffffff; font-weight:800; font-size:13px;">${w || partsWarrantyText}</div>
            ${w ? "" : `<div style="color:#cbd5e1; font-size:11px; margin-top:2px;">${partsWarrantyNote}</div>`}
          </td></tr>
        </table>`).join("")}
        ${rooftop ? `<table style="width:100%; background:#fefce8; border:1px solid #fde68a; border-radius:10px; margin-bottom: 14px;" cellpadding="0" cellspacing="0"><tr><td style="padding:10px 14px; font-size:12px; color:#854d0e; font-weight:700;">${isEs ? "Las instalaciones en azotea pueden añadir $800–$2,000 por grúa/maniobras. Confirmaremos el monto exacto con usted para su aprobación antes de la entrega." : "Rooftop installs may add $800–$2,000 for crane/rigging. We'll confirm the exact amount with you for approval before delivery."}</td></tr></table>` : ""}

        ${eq ? `
        <div style="font-weight:900; font-size:14px; color:${navy}; margin-bottom: 8px;">${useLines ? (isEs ? "Lo Que Incluye" : "What's Included") : includesHeading}</div>
        <table style="width:100%; border-collapse:collapse; margin-bottom: 18px;">
          ${installItemsHtml}
        </table>
        ` : ""}

        <!-- Guarantee badge -->
        <table style="width:100%; background:#f0f9ff; border:1.5px solid ${accent}; border-radius:12px; margin-bottom: 22px;" cellpadding="0" cellspacing="0">
          <tr><td style="padding:12px 16px; color:${navy}; font-size:13px; font-weight:700; text-align:center;">${guaranteeText}</td></tr>
        </table>

        <!-- CTA -->
        ${booked ? "" : links ? `
        <a href="${links.approve}" style="display:block; text-align:center; background:${accent}; color:#ffffff; padding:15px 24px; border-radius:50px; text-decoration:none; font-weight:900; font-size:16px; margin-bottom:10px;">
          ${isEs ? "Aprobar y Elegir Mi Fecha de Instalación" : "Approve & Choose My Install Date"}
        </a>
        <a href="${links.view}" style="display:block; text-align:center; background:#ffffff; color:${accent}; border:2px solid ${accent}; padding:13px 24px; border-radius:50px; text-decoration:none; font-weight:800; font-size:15px;">
          ${isEs ? "Ver Mi Cotización" : "View My Quote"}
        </a>
        <p style="color:#94a3b8; font-size:11px; text-align:center; margin:10px 0 0;">${isEs ? "Este enlace es personal — abre exactamente esta cotización con su precio garantizado." : "This link is personal — it opens exactly this quote at its guaranteed price."}</p>` : `
        <a href="https://systemestimate.air-careconnect.com" style="display:block; text-align:center; background:${accent}; color:#ffffff; padding:14px 24px; border-radius:50px; text-decoration:none; font-weight:800; font-size:15px;">
          ${ctaText}
        </a>`}
      </div>

      <!-- Footer -->
      <div style="background:#f8fafc; padding: 18px 26px; text-align:center; border-top:1px solid #e2e8f0;">
        <p style="color:#94a3b8; font-size:11px; margin:0; font-weight:600;">${brandName} - ${footerTagline}</p>
      </div>
    </div>
  </div>
  `;
}

// ── BOOKING CONFIRMATION EMAIL TEMPLATE ───────────────────────────────────────
function buildConfirmationEmailHtml({ lang, brandName, customerName, bookingRef, installDate, address, eq, total, paymentMethod, isFinancing }) {
  const isEs = lang === "es";
  const accent = "#00B0F0";
  const navy = "#163E64";
  const green = "#16a34a";

  const greeting = isEs ? `Hola${customerName ? " " + customerName : ""},` : `Hi${customerName ? " " + customerName : ""},`;
  const headline = isEs ? "¡Está Todo Listo!" : "You're All Set!";
  const intro = isEs
    ? "Su instalación está programada. Aquí está la confirmación de su reserva:"
    : "Your installation is scheduled. Here's your booking confirmation:";
  const bookingRefLabel = isEs ? "Referencia de Reserva" : "Booking Reference";
  const installDateLabel = isEs ? "Fecha de Instalación" : "Installation Date";
  const addressLabel = isEs ? "Dirección de Instalación" : "Installation Address";
  const systemLabel = isEs ? "Sistema" : "System";
  const totalLabel = isEs ? "Precio Total" : "Total Price";
  const whatNextHeading = isEs ? "Qué Sigue" : "What Happens Next";

  const deposit = total ? Math.round(total * 0.5) : 0;
  const balance = total ? total - deposit : 0;

  // Payment status messaging - this is the receipt/acknowledgment for what's already paid,
  // and clear expectation-setting for what (if anything) is due on install day
  let paymentStatusLabel, paymentStatusMessage;
  if (isFinancing) {
    paymentStatusLabel = isEs ? "Estado del Pago" : "Payment Status";
    paymentStatusMessage = isEs
      ? "Pendiente la aprobación de su financiamiento, no se requerirá pago el día de la instalación."
      : "Pending your financing approval, no payment will be required at installation.";
  } else if (total) {
    paymentStatusLabel = isEs ? "Pago Recibido" : "Payment Received";
    paymentStatusMessage = isEs
      ? `Hemos recibido su depósito de $${deposit.toLocaleString()}. Por favor pague el saldo restante de $${balance.toLocaleString()} al técnico líder una vez que la instalación esté completa.`
      : `We've received your deposit of $${deposit.toLocaleString()}. Please pay the remaining balance of $${balance.toLocaleString()} to the lead technician once installation is complete.`;
  } else {
    paymentStatusLabel = null;
    paymentStatusMessage = null;
  }

  const formattedDate = installDate
    ? new Date(installDate + "T00:00:00").toLocaleDateString(isEs ? "es-ES" : "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "";

  const nextSteps = isFinancing
    ? (isEs
        ? [
            "Complete su solicitud de financiamiento si aún no lo ha hecho",
            "Nuestro equipo le llamará dentro de 1 día hábil para confirmar los detalles",
            "Nuestros técnicos llegarán en su fecha programada, listos para instalar",
          ]
        : [
            "Complete your financing application if you haven't already",
            "Our team will call you within 1 business day to confirm details",
            "Our technicians will arrive on your scheduled date, ready to install",
          ])
    : (isEs
        ? [
            "Recibirá un recibo de pago por separado de Stripe",
            "Nuestro equipo le llamará dentro de 1 día hábil para confirmar los detalles",
            "Nuestros técnicos llegarán en su fecha programada, listos para instalar",
          ]
        : [
            "You'll receive a separate payment receipt from Stripe",
            "Our team will call you within 1 business day to confirm details",
            "Our technicians will arrive on your scheduled date, ready to install",
          ]);

  const nextStepsHtml = nextSteps.map((step, i) => `
    <tr><td style="padding:5px 0; font-size:13px; color:${navy}; font-weight:600; vertical-align:top;">
      <span style="color:${accent}; font-weight:900;">${i + 1}.</span> ${step}
    </td></tr>
  `).join("");

  const footerTagline = isEs ? "Siempre Conectados. Siempre Cómodos." : "Always Connected. Always Comfortable.";

  return `
  <div style="font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; background:#CAEEFB; padding: 24px 16px;">
    <div style="background:#ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background: linear-gradient(135deg, ${accent}, ${navy}); padding: 28px 24px; text-align: center;">
        <div style="width:64px; height:64px; border-radius:50%; background:${green}; display:inline-block; line-height:64px; font-size:32px; color:#ffffff; font-weight:900; margin-bottom:10px;">&#10003;</div>
        <div style="color: #ffffff; font-weight: 900; font-size: 22px;">${headline}</div>
      </div>

      <!-- Body -->
      <div style="padding: 28px 26px;">
        <p style="color:${navy}; font-size:15px; font-weight:700; margin: 0 0 6px;">${greeting}</p>
        <p style="color:#475569; font-size:14px; margin: 0 0 20px; line-height:1.5;">${intro}</p>

        <table style="width:100%; background:#f0f9ff; border:2px solid ${accent}; border-radius:16px; margin-bottom: 18px;" cellpadding="0" cellspacing="0">
          <tr><td style="padding:18px;">
            <table style="width:100%;">
              <tr><td style="padding:5px 0; color:#64748b; font-size:12px;">${bookingRefLabel}</td><td style="padding:5px 0; text-align:right; font-weight:800; color:${navy}; font-size:13px;">${bookingRef}</td></tr>
              <tr><td style="padding:5px 0; color:#64748b; font-size:12px; border-top:1px solid #bae6fd;">${installDateLabel}</td><td style="padding:5px 0; text-align:right; font-weight:800; color:${navy}; font-size:13px; border-top:1px solid #bae6fd;">${formattedDate}</td></tr>
              ${address ? `<tr><td style="padding:5px 0; color:#64748b; font-size:12px; border-top:1px solid #bae6fd;">${addressLabel}</td><td style="padding:5px 0; text-align:right; font-weight:700; color:${navy}; font-size:12px; border-top:1px solid #bae6fd;">${address}</td></tr>` : ""}
              ${eq ? `<tr><td style="padding:5px 0; color:#64748b; font-size:12px; border-top:1px solid #bae6fd;">${systemLabel}</td><td style="padding:5px 0; text-align:right; font-weight:700; color:${navy}; font-size:12px; border-top:1px solid #bae6fd;">${eq.outdoor_brand || ""} ${eq.outdoor_series || ""}</td></tr>` : ""}
              ${total ? `<tr><td style="padding:5px 0; color:#64748b; font-size:12px; border-top:1px solid #bae6fd;">${totalLabel}</td><td style="padding:5px 0; text-align:right; font-weight:900; color:${navy}; font-size:15px; border-top:1px solid #bae6fd;">$${total.toLocaleString()}</td></tr>` : ""}
            </table>
          </td></tr>
        </table>

        ${paymentStatusMessage ? `
        <table style="width:100%; background:${isFinancing ? "#fefce8" : "#f0fdf4"}; border:1px solid ${isFinancing ? "#fde68a" : "#86efac"}; border-radius:10px; margin-bottom: 18px;" cellpadding="0" cellspacing="0">
          <tr><td style="padding:14px 16px;">
            <div style="font-weight:800; font-size:13px; color:${isFinancing ? "#92400e" : "#166534"}; margin-bottom:5px;">${paymentStatusLabel}</div>
            <div style="font-size:12px; color:${isFinancing ? "#78350f" : "#166534"}; line-height:1.5;">${paymentStatusMessage}</div>
          </td></tr>
        </table>
        ` : ""}

        <div style="font-weight:900; font-size:14px; color:${navy}; margin-bottom: 10px;">${whatNextHeading}</div>
        <table style="width:100%; border-collapse:collapse; margin-bottom: 8px;">
          ${nextStepsHtml}
        </table>
      </div>

      <!-- Footer -->
      <div style="background:#f8fafc; padding: 18px 26px; text-align:center; border-top:1px solid #e2e8f0;">
        <p style="color:#94a3b8; font-size:11px; margin:0; font-weight:600;">${brandName} - ${footerTagline}</p>
      </div>
    </div>
  </div>
  `;
}

// IMPORTANT: buildCustomerContext function signature below - do not delete this line when editing nearby functions
function buildCustomerContext(ctx) {
  if (!ctx) return "The customer has not started their estimate yet — they're on the landing page.";

  const parts = [];

  if (ctx.property?.address) {
    parts.push(`Customer's property address: ${ctx.property.address}`);
    if (ctx.property.beds) parts.push(`Home details: ${ctx.property.beds} bed, ${ctx.property.baths} bath, ${ctx.property.sqft} sqft, built ${ctx.property.year}, type: ${ctx.property.type}`);
  }

  if (ctx.answers) {
    const a = ctx.answers;
    if (a.systemType) {
      const sysLabel = { electric: "Split Heat Pump (all electric)", package: "Package Unit (all outdoor, common in manufactured homes)", gas: "Gas Furnace + AC System" }[a.systemType];
      parts.push(`Current system type: ${sysLabel}`);
    }
    if (a.coolWell) {
      const coolLabel = { yes: "cools the home well currently", used_to: "used to cool well but has declined", struggled: "has always struggled to cool the home", unsure: "customer isn't sure if it cools adequately" }[a.coolWell];
      parts.push(`Cooling performance: ${coolLabel}`);
    }
    if (a.floodZone) parts.push(`Flood zone: ${a.floodZone}`);
    if (a.systemAge) parts.push(`Current system age: ${a.systemAge === "old" ? "more than 15 years old" : a.systemAge === "new" ? "less than 15 years old" : "unknown"}`);
    if (a.hoa) parts.push(`HOA approval required: ${a.hoa}`);
  }

  if (ctx.tons) {
    parts.push(`Calculated system size needed: ${ctx.tons} tons`);
  }

  if (ctx.brandFamily) {
    parts.push(`Customer is currently browsing the "${ctx.brandFamily}" brand family`);
  }

  if (ctx.selectedEq) {
    const eq = ctx.selectedEq;
    const total = (eq.installation_price || 0) + (ctx.adderTotal || 0);
    parts.push(`Customer is currently viewing/selected this specific system: ${eq.outdoor_brand} ${eq.outdoor_series}, ${eq.size_tons} tons, SEER2 ${eq.seer2}, priced at $${total.toLocaleString()} installed`);
    if (eq.quality_pledge) {
      const isGoodmanLifetime = eq.quality_pledge_years === 999 && eq.quality_pledge_issuer === "Goodman";
      if (isGoodmanLifetime) {
        parts.push(`This system includes Goodman's Limited Lifetime Compressor Guarantee: covers the COMPRESSOR ONLY for as long as the original, registered purchaser owns and resides in the home. Does NOT transfer to a new owner. REQUIRES registration with Goodman to activate. All other components carry the standard 10-Year Parts Limited Warranty, not lifetime.`);
      } else {
        const pledgeYears = eq.quality_pledge_years;
        parts.push(`This system includes a ${pledgeYears}-Year Quality Pledge from ${eq.quality_pledge_issuer}: if the compressor fails within ${pledgeYears} years due to a manufacturer defect, customer chooses new compressor OR full outdoor unit replacement, at no cost.`);
      }
    }
  }

  if (ctx.screen) {
    const screenLabels = {
      s1: "Landing page", s2: "Entering their address", s3: "Confirming their home details",
      s4: "Choosing what to estimate", s5: "Answering cooling performance question",
      s6: "Answering flood zone question", s7: "Answering system age question",
      s8: "Answering HOA question", s9: "Identifying their current system type",
      s10: "Waiting for their estimate to calculate", s11: "Viewing their price range, about to choose a brand family",
      s12: "Choosing a brand family", s13: "Choosing a specific brand",
      s14: "Comparing specific equipment options", s15: "Reviewing full details of a selected system",
      s16: "Entering contact information", checkout: "Choosing a payment method",
      pay_card: "Entering card payment details", pay_ach: "Entering bank transfer details",
      pay_ftl: "About to apply for FTL financing", pay_microf: "About to apply for Microf lease-to-own",
      schedule: "Choosing an installation date", confirmation: "Booking confirmed",
    };
    parts.push(`Current screen: ${screenLabels[ctx.screen] || ctx.screen}`);
  }

  return parts.length > 0 ? parts.join(". ") + "." : "The customer has not started their estimate yet.";
}

// Duct cleaning version of the customer context and the Comfort Guide's instructions.
function buildDuctContext(ctx) {
  const d = ctx?.duct || {};
  const parts = [];
  if (ctx?.property?.address) parts.push(`Property address: ${ctx.property.address}`);
  const sq = d.sqft || ctx?.property?.sqft;
  if (sq) parts.push(`Heated/cooled square feet: ${sq}`);
  const lab = (list, id) => { const r = list.find(x => x[0] === id); return r ? r[1] : null; };
  const homeLabels = { sitebuilt: "site-built single-family", plex: "duplex/triplex/quad", mobile: "mobile home", modular: "modular home", apt: "multi-story apartment or condo", multistory: "multi-story single-family" };
  if (d.homeKind) parts.push(`Home type: ${homeLabels[d.homeKind] || d.homeKind}`);
  if (d.vents) parts.push(`Vents are mostly: ${lab(DUCT_VENTS, d.vents)}`);
  if (d.lastCleaned) parts.push(`Ducts last cleaned: ${lab(DUCT_LAST, d.lastCleaned)}`);
  if (d.ductType) parts.push(`Duct type: ${lab(DUCT_TYPES, d.ductType)}`);
  if (d.rooms) {
    const r = DUCT_ROOMS.filter(([k]) => Number(d.rooms[k]) > 0).map(([k, en]) => `${d.rooms[k]} ${en}`);
    if (r.length) parts.push(`Rooms: ${r.join(", ")}`);
  }
  if (d.ahu) parts.push(`Air handler location: ${lab(DUCT_AHU, d.ahu)}${d.ahu === "ceiling" || d.ahu === "attic" ? " (so blower and coil cleaning are not offered online — they need an in-person look)" : ""}`);
  const q = ctx?.ductQuote;
  if (q && q.lines.length && (d.services || []).some(k => k !== "covers")) {
    parts.push(`Customer's current quote (real prices from our pricebook): ${q.lines.map(l => `${l.label} — $${(l.qty * l.price).toFixed(2)}`).join("; ")}. Total $${q.total.toFixed(2)}${q.tax ? ` including $${q.tax.toFixed(2)} sales tax` : ""}`);
    if (q.needsVisit) parts.push("Sanitizing for this home size needs an in-person price, so it is not in the total");
  } else {
    parts.push("The customer has not chosen services yet, so there is no quote yet");
  }
  const screens = {
    d1: "Landing page", s2: "Entering their address", s3: "Confirming their home details", dHome: "Choosing their home type",
    dVents: "Saying where their vents are", dLast: "Saying when the ducts were last cleaned", dType: "Choosing their duct type",
    dRooms: "Counting rooms and confirming square feet", dAhu: "Saying where the air handler is", dServices: "Choosing services",
    dQuote: "Reviewing their guaranteed quote", dForm: "Entering contact information", dSchedule: "Choosing a service day",
    dPay: "Choosing to pay now by card or on the day of service", dCard: "Entering card details", confirmation: "Booking confirmed",
  };
  if (ctx?.screen) parts.push(`Current screen: ${screens[ctx.screen] || ctx.screen}`);
  return parts.join(". ") + ".";
}

function ductGuidePrompt(lang, contextSnapshot, ctx) {
  const days = ctx?.guaranteeDays || 14;
  const start = ctx?.startLabel || "9:00 AM";
  const warranty = String(ctx?.warrantyText || "").trim();
  if (lang === "es") return `Eres el Guía de Confort — un asesor virtual cálido y honesto de Aire Azul, una empresa de HVAC que sirve los condados de Marion, Lake, Sumter, Levy, Citrus y Alachua y The Villages en el Centro de Florida. En esta aplicación el cliente obtiene una cotización garantizada de LIMPIEZA DE DUCTOS y LIMPIEZA DEL DUCTO DE SECADORA, sin vendedores.

CONTEXTO ACTUAL DEL CLIENTE:
${contextSnapshot}

DATOS DEL SERVICIO:
- Retiramos y limpiamos todas las rejillas de suministro y de retorno donde sea posible, limpiamos los ductos a fondo y volvemos a colocar las rejillas. Cubrimos ligeramente los muebles para evitar que les caiga polvo.
- La desinfección se hace a través de los retornos y el sistema de A/C. Personas y mascotas no necesitan salir; las aves deben retirarse por 30 minutos.
- Servicios opcionales: limpiar el motor y la rueda del soplador, limpiar el serpentín evaporador en sitio, instalar una luz UV en el manejador de aire, y limpiar el ducto de la secadora. Si el manejador de aire cuelga del techo o está en el ático, la limpieza del soplador y del serpentín no se ofrece en línea — requiere una visita.
- La cotización está garantizada por ${days} días. El precio viene de nuestra lista de precios real según las respuestas del cliente.
- No se paga nada por adelantado. Se paga el día del servicio con cheque, tarjeta o efectivo; si lo desea, puede pagar con tarjeta por adelantado en la aplicación — es totalmente opcional.
- Llegamos a las ${start} el día que el cliente elija.
- ${warranty ? `Garantía: ${warranty}.` : "Tenemos una garantía de rendimiento; para los detalles, el cliente puede preguntar a nuestro equipo."}

HONESTIDAD (muy importante):
- No todas las casas necesitan limpieza de ductos con un calendario fijo. Es más útil cuando hay polvo o residuos visibles saliendo de las rejillas, moho visible dentro de los ductos, señales de roedores o insectos, después de una remodelación, o si nunca se han limpiado. Si la casa no lo necesita, dilo.
- Nunca afirmes que la limpieza de ductos cura alergias o asma, ni que garantiza facturas de luz más bajas.
- Un ducto de secadora tapado con pelusa es un riesgo de incendio real y reduce la eficiencia de la secadora; recomendar su limpieza es honesto.

REGLAS:
- Puedes repetir los precios y el total que aparecen en el contexto de la cotización actual del cliente. Nunca inventes precios para servicios que no están en ella; di que los verá al elegir los servicios en la aplicación.
- Si el cliente quiere que se le envíe la cotización y ya hay una cotización, pide nombre, correo y teléfono, y usa la herramienta send_estimate. Nunca digas que la enviaste sin usarla.
- Si prefiere que alguien venga en persona, pide nombre y teléfono y usa request_home_visit; sé honesto en que alguien le llamará.
- Mantente en el tema: limpieza de ductos, ducto de secadora, calidad del aire interior relacionada, el proceso de la aplicación y las políticas de la empresa. No cotices reemplazo de equipos aquí.
- Responde siempre en español, de forma breve (2 a 4 oraciones) y nunca seas insistente.`;
  return `You are the Comfort Guide — a warm, honest virtual advisor for Air-Care Connect, an HVAC company serving Marion, Lake, Sumter, Levy, Citrus, and Alachua Counties plus The Villages in Central Florida. In this app the customer gets a guaranteed quote for DUCT CLEANING and DRYER VENT CLEANING, with no salesperson involved.

CURRENT CUSTOMER CONTEXT:
${contextSnapshot}

ABOUT THE SERVICE:
- We remove and clean all supply and return vents where possible, thoroughly clean the ducts, then replace the vents. We lightly cover furniture where possible so no dust falls on it.
- Sanitizing is done through the returns and the A/C system. People and pets don't need to leave; birds should be removed for 30 minutes.
- Optional services: clean the blower motor and wheel, clean the evaporator coil in place, install a UV light in the air handler, and clean the dryer vent. When the air handler hangs from the ceiling or sits in the attic, blower and coil cleaning aren't offered online — they need an in-person look.
- The quote is guaranteed for ${days} days. Prices come straight from our real pricebook based on the customer's answers (rooms, vent location, air handler location, square feet for sanitizing, home type for the dryer vent).
- Nothing is paid in advance. The customer pays on the day of service by check, card or cash. If they want, they can prepay by card in the app — that is entirely optional, never imply it's required.
- We arrive at ${start} on the day the customer picks.
- ${warranty ? `Warranty: ${warranty}.` : "We offer a performance warranty; for the details, the customer can ask our team."}

HONESTY (this matters most):
- Not every home needs duct cleaning on a schedule. It's most worthwhile when dust or debris visibly blows from the vents, there's visible mold growth inside the ducts, there are signs of rodents or insects, after a renovation, or if the ducts have never been cleaned. If what the customer describes doesn't call for it, say so plainly — it's fine to tell them they may not need it yet.
- Never claim duct cleaning cures allergies or asthma, or guarantees lower energy bills.
- A lint-clogged dryer vent is a real fire risk and makes the dryer work harder, so recommending dryer vent cleaning is honest advice.
- "Last cleaned" and "duct type" don't change the price — they help the crew plan the job.

HOW TO HELP:
- Explain any question or service on the current screen in plain language.
- You may repeat the line items and total shown in the customer's current quote context above. Never make up prices for services that aren't in it — say they'll see the exact price when they choose services in the app.
- If they hesitate, acknowledge it, note there's no rush (the price holds for ${days} days and nothing is due up front), and offer a concrete next step: email the quote, or save progress and come back.

SENDING THE QUOTE: If a customer wants their quote emailed or texted and a quote exists, collect name, email and phone conversationally, then use the send_estimate tool. Never say you sent it unless you used the tool. If there's no quote yet, explain they'll get one right after choosing services.

IN-PERSON VISIT: If the customer prefers someone come look first (or asks about blower/coil cleaning with an attic or ceiling-hung air handler), collect name and phone (email optional) and use request_home_visit. Be honest that a team member will call — nothing is booked automatically.

GUARDRAILS:
- Stay on topic: duct cleaning, dryer vents, related indoor air quality, this app's process, and company policies. For AC replacement questions, say this app is for duct cleaning and they can get a system quote from the main estimate app.
- Keep replies conversational and short — 2-4 sentences. Never be pushy.`;
}

// ── COMFORT GUIDE ──────────────────────────────────────────────────────────────
function ComfortGuide({ lang, brand, t, onClose, customerContext, onDuctEmail }) {
  const isDuct = customerContext?.mode === "duct";
  const ductWelcome = L(lang,
    "Hi! I'm your Comfort Guide. I can explain how duct cleaning, sanitizing and dryer vent cleaning work, help you decide what your home actually needs, or answer questions about your quote. What's on your mind?",
    "¡Hola! Soy su Guía de Confort. Puedo explicarle cómo funciona la limpieza de ductos, la desinfección y la limpieza del ducto de secadora, ayudarle a decidir lo que su casa realmente necesita o responder preguntas sobre su cotización. ¿En qué puedo ayudarle?");
  const [msgs, setMsgs] = useState([{ role: "assistant", content: isDuct ? ductWelcome : t.cgWelcome }]);
  const [input, setInput] = useState(""); const [busy, setBusy] = useState(false);
  const [sendStatus, setSendStatus] = useState(null); // null | "sending" | "sent" | "error"
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

  // Capture a home visit request as a real lead - pursued as a lead, not a sale.
  // Notifies the office team by email so it gets followed up on, not just stored silently.
  const requestHomeVisit = async (name, phone, email, notes) => {
    setSendStatus("sending");
    try {
      const address = customerContext?.property?.address || null;

      await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: "POST",
        headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({
          lead_type: "home_visit_request",
          property_address: address,
          customer_name: name,
          customer_email: email || null,
          customer_phone: phone,
          notes: (isDuct ? "[Duct cleaning] " : "") + (notes || "") || null,
          language: lang,
          lead_status: "new",
          organization_id: 1,
        }),
      });

      // Notify the office so a real human follows up - this is the whole point of the feature
      try {
        await fetch("/api/send-email", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: "info@air-careconnect.com",
            subject: `New Home Visit Request${isDuct ? " (Duct Cleaning)" : ""} - ${name}`,
            htmlContent: `
              <div style="font-family: sans-serif; max-width: 480px;">
                <h2 style="color: #163E64;">New Home Visit Request</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
                ${address ? `<p><strong>Address:</strong> ${address}</p>` : ""}
                ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
                <p style="color:#64748b; font-size:13px;">Submitted via Comfort Guide - pursue as a lead.</p>
              </div>
            `,
          }),
        });
      } catch(e) { console.warn("Office notification email error:", e); }

      setSendStatus("sent");
    } catch(e) {
      console.error("Home visit request error:", e);
      setSendStatus("error");
    }
  };

  // Actually send the estimate via email + SMS, and save the quote to Supabase
  const sendEstimateToCustomer = async (name, email, phone) => {
    setSendStatus("sending");
    const debugErrors = [];
    try {
      const eq = customerContext?.selectedEq;
      const total = eq ? (eq.installation_price || 0) + (customerContext?.adderTotal || 0) : null;
      const address = customerContext?.property?.address || "your property";

      // Save quote with contact info to Supabase
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/quotes`, {
          method: "POST",
          headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify({
            property_address: address,
            ahri_ref: eq?.ahri_ref || null,
            final_price: total,
            brand_family_selected: customerContext?.brandFamily || null,
            language: lang,
            quote_status: "pending",
          }),
        });
      } catch(e) { console.warn("Quote save error:", e); }

      // Send email if we have one
      if (email) {
        const monthly = total ? Math.round(total / 60) : 0;
        try {
          const emailResp = await fetch("/api/send-email", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: email,
              subject: lang === "es" ? `Su Cotización de ${brand.name}` : `Your ${brand.name} Quote`,
              htmlContent: buildQuoteEmailHtml({
                lang, brandName: brand.name, customerName: name, address,
                eq, total: total || 0, monthly, deposit: null,
              }),
            }),
          });
          const emailData = await emailResp.json().catch(() => ({}));
          if (!emailResp.ok) {
            debugErrors.push(`EMAIL (${emailResp.status}): ${emailData.error || "unknown error"}`);
          }
        } catch(e) {
          debugErrors.push(`EMAIL (network): ${e.message}`);
        }
      }

      // Send SMS if we have a phone number
      if (phone) {
        const priceLine = total ? `$${total.toLocaleString()}` : "your estimate";
        const smsBody = lang === "es"
          ? `${brand.name}: Su cotización para ${address} es ${priceLine}, garantizada por 45 días.`
          : `${brand.name}: Your quote for ${address} is ${priceLine}, guaranteed for 45 days.`;
        try {
          const smsResp = await fetch("/api/send-sms", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: phone, message: smsBody }),
          });
          const smsData = await smsResp.json().catch(() => ({}));
          if (!smsResp.ok) {
            debugErrors.push(`SMS (${smsResp.status}): ${smsData.error || "unknown error"}`);
          }
        } catch(e) {
          debugErrors.push(`SMS (network): ${e.message}`);
        }
      }

      if (debugErrors.length > 0) {
        console.error("Send estimate errors:", debugErrors);
        setSendStatus("error");
        setMsgs(p => [...p, { role: "assistant", content: `⚠️ DEBUG INFO:\n${debugErrors.join("\n")}` }]);
      } else {
        setSendStatus("sent");
      }
    } catch(e) {
      console.error("Send estimate error:", e);
      setSendStatus("error");
      setMsgs(p => [...p, { role: "assistant", content: `⚠️ DEBUG INFO: ${e.message}` }]);
    }

  };

  const send = async () => {
    if (!input.trim() || busy) return;
    const next = [...msgs, { role: "user", content: input.trim() }];
    setMsgs(next); setInput(""); setBusy(true);

    const contextSnapshot = isDuct ? buildDuctContext(customerContext) : buildCustomerContext(customerContext);
    const ductHasQuote = isDuct && customerContext?.ductQuote?.lines?.length > 0 && (customerContext?.duct?.services || []).some(k => k !== "covers");

    try {
      const sys = isDuct ? ductGuidePrompt(lang, contextSnapshot, customerContext) : lang === "en"
        ? `You are the Comfort Guide — a warm, knowledgeable virtual advisor for Air-Care Connect, a professional HVAC replacement company serving Marion, Lake, Sumter, Levy, Citrus, and Alachua Counties plus The Villages in Central Florida.

YOUR ROLE: Help customers feel confident and informed as they get an instant AC replacement quote through this app, entirely without sales pressure. You are not a salesperson — you are a trusted guide. Your job is to remove confusion and hesitation so the customer can make their own confident decision.

CURRENT CUSTOMER CONTEXT (use this to give specific, relevant answers — never generic ones if specific info is available):
${contextSnapshot}

KEY FACTS ABOUT AIR-CARE CONNECT:
- Every quote is guaranteed for 45 days — the price will not increase
- Installation always includes: the system itself, concrete pad, brand new copper refrigerant lines, hurricane clips, float switch to prevent drain backups, UV light, a 2-inch filter rack, all labor, all permits, and haul-away of the old system
- Every home gets a 10-Year Limited Parts Warranty — this is required by Florida law on every system, no exceptions
- Some systems also carry a separate "Quality Pledge" from the manufacturer, and the exact terms differ by brand — be precise about which one applies to whichever system is being discussed:
  -- NORTEK brands (including Frigidaire and others under the Nortek umbrella): If the compressor fails within the stated period (1, 5, or 10 years depending on the specific model), the customer chooses between a brand new replacement compressor OR a complete replacement of the entire outdoor/condenser unit, at no cost. This excludes damage from abuse, neglect, or natural disaster, and maintenance records may be requested.
  -- GOODMAN (select premium models only, called "Limited Lifetime Compressor Guarantee"): Covers the COMPRESSOR ONLY (not the full unit) for as long as the ORIGINAL, REGISTERED purchaser owns and resides in the home where it was installed. Three critical details to always mention if discussing this: (1) it does NOT transfer to a new owner if the home is sold, (2) it REQUIRES product registration with Goodman to activate — an unregistered unit typically defaults to a much shorter standard warranty instead, and (3) all OTHER components on the system (blower motors, coils, etc.) carry the standard 10-Year Parts Limited Warranty, not lifetime coverage. Never imply "Lifetime" means the whole system or that it transfers with the home — always clarify it's the compressor only, for the original registered owner.
  -- Never use the word "Lifetime" without immediately clarifying these conditions if a customer asks about a Goodman system specifically.
  -- IMPORTANT REASSURANCE: Air-Care Connect handles the registration requirement automatically — we register every system on the customer's behalf at no extra step for them, and send them a copy of the registration certificate for their records. This means customers never have to worry about missing the registration deadline or losing their coverage through an oversight — a real and meaningful advantage worth mentioning when a customer expresses any hesitation about warranty registration or paperwork.
- Two technicians are sent on every single job
- No after-hours or weekend surcharges, ever
- A 50% deposit is required to schedule installation — EXCEPT when financing through FTL or Microf, where no deposit is needed today
- Payment options: Credit/debit card (instant, via Stripe), ACH bank transfer (no card fees, 1-3 day verification), FTL financing (traditional credit-based loan, customer owns the system immediately), Microf lease-to-own (flexible approval, doesn't require great credit, customer leases then owns later)
- Brand families: Budget-Friendly (practical, reliable), Commonly Purchased (best balance of price/features), Trending This Year (side-discharge systems — currently our most efficient and innovative option), Premium Products (top-tier efficiency and features)
- The customer never has to talk to a salesperson or schedule an in-home visit just to get a real, guaranteed price

HOW TO HANDLE HESITATION AND OBJECTIONS (use genuinely, never as a manipulative script):
When a customer expresses doubt, use this natural three-step pattern — acknowledge their feeling, normalize it by noting others have felt the same, then redirect to a genuine reason for confidence (not a forced pitch):

-- "This seems expensive" / sticker shock: Acknowledge that a new AC system is a real investment and it's normal to feel that way. Note that many customers feel the same way at first glance. Then redirect to genuine value: the price shown is the COMPLETE installed price (no hidden add-ons after the fact), it's guaranteed for 45 days so there's no rush to decide today, and financing through FTL or Microf can spread the cost into a manageable monthly payment — mention the approximate monthly figures if you have them from context. If a higher-SEER option exists in their results, you can mention that a more efficient system often pays some of itself back over time through lower electric bills, but only raise this if they seem price-focused, not as an automatic upsell.

-- "I want to think about it" / stalling: This is healthy and you should never discourage it — but customers stalling often just don't know what their actual next step is. Reassure them there's no rush given the 45-day guarantee, and offer a concrete, low-pressure next step: they can save their progress and come back anytime (mention the Save My Progress feature), or review the full system details again, or ask you any specific question holding them back right now. Never pressure someone who says they want to think it over — your job is to remove friction from THEIR next visit, not rush this one.

-- "I want to get a few other quotes first": This is completely reasonable and you should say so genuinely. Then highlight what's different about getting a quote here versus elsewhere: they already have a real, complete, guaranteed price without a salesperson visit, an awkward in-home pitch, or any pressure tactics. If they're comparing, the price they have right now from Air-Care Connect is locked for 45 days — so they're free to compare with zero risk of losing this offer. If they'd still like an in-home visual assessment for their own peace of mind, mention that Air-Care Connect can arrange or refer one — but it's entirely optional, not a sales visit.

URGENCY FRAMING (use honestly — this is a real guarantee, not manufactured pressure):
The 45-day price guarantee is a genuine reason to act without being pushy about it. You can naturally mention that locking in today's price means no surprises later — manufacturer and material costs can shift, so getting the guarantee while it's active protects them from a price increase, not from "missing out" on something artificial. Frame it as protecting THEM, not as a countdown timer pressuring them.

COMPETITIVE POSITIONING (only when relevant — never unprompted bashing of competitors):
If a customer compares Air-Care Connect to "getting a few quotes" or traditional companies, emphasize these genuine differentiators:
-- Full pricing transparency: they see the real, complete, installed price before ever speaking to anyone — no bait-and-switch after a technician shows up
-- No mandatory home visit: most competitors require an in-home sales visit just to get a number. Here, an in-home visit is optional and available only if THEY want one for their own peace of mind — Air-Care Connect can arrange or refer this, but it's never required
-- Financing privacy: they can explore and apply for financing entirely on their own time, privately, without a salesperson standing in their living room while they discuss their finances
-- The 45-day guarantee removes the pressure that traditional "today-only" sales tactics create — there is no reason to decide on the spot, and that's intentional

SEER / EFFICIENCY UPSELL GUIDANCE (reactive only — never volunteer this unprompted):
Only discuss higher-SEER options and long-term energy savings if the customer specifically asks about SEER ratings, efficiency, or energy bills. When they do ask, explain genuinely: a higher SEER2 rating means the system uses less electricity to produce the same cooling, which can meaningfully lower monthly electric bills over the system's lifespan, especially in Florida's climate where AC runs most of the year. If their current equipment options include a higher-efficiency choice, you can mention it's available to compare. Never bring this up as an unprompted upsell — only respond to genuine interest.

WHEN A CUSTOMER ASKS ABOUT A BRAND WE DON'T CARRY:
Air-Care Connect deliberately and selectively chooses which brands and specific models to offer, based on real field performance, reliability, and parts availability — this list can change throughout the year as manufacturers issue corrections or as field data changes. If a customer asks why a specific brand isn't offered, or asks about a brand you don't see in the available options, respond with calm, confident, non-disparaging language. Never name specific defects, recalls, or failure modes — that creates liability and isn't your role to adjudicate. A good response is something like: "We selectively choose which brands and models we install based on field performance and reliability, and that lineup can shift during the year. We're not currently offering that one, but we'd be glad to show you excellent alternatives in a similar price range that we stand behind." Then proactively offer to help them look at brand families/options that ARE available. Never apologize excessively or imply something is wrong with their question — this is simply normal, responsible business practice.

OFFERING AN IN-PERSON HOME VISIT (for customers who prefer a live conversation over the self-service app):
While most customers are comfortable with the instant, self-service quoting process, some genuinely prefer talking to a real person in their home before deciding — and that's completely fine. You can offer this naturally in two situations:
1. REACTIVELY: if a customer directly asks for an in-person visit, a salesperson, or says something like "I'd rather have someone come look at it"
2. PROACTIVELY but sparingly: if you notice genuine, repeated hesitation after you've already tried the objection-handling approaches above (Feel-Felt-Found) and the customer still seems stuck or uncomfortable with the self-service format itself (not just price hesitation) — you can gently mention this as an alternative, once, without being pushy: something like "If you'd ever prefer to have someone come take a look in person and walk through it with you, that's available too — just let me know."
Never offer this as a first response to ordinary price objections — exhaust the normal objection-handling approach first, since most price concerns are genuinely better resolved by the guarantee/financing information, not by escalating to a salesperson.
If a customer wants this:
1. Collect their name and phone number (a callback number is required), email is optional
2. Ask briefly if there's anything specific they'd like the visit to address, but don't push for this if they don't offer it
3. Once you have name + phone AND they've confirmed they want this, use the request_home_visit tool
4. This creates a real lead for the office team to follow up on - be honest that a team member will call them, not that anything is automatically scheduled or guaranteed yet

SENDING THE ESTIMATE (when a customer wants their quote emailed or texted to them):
If a customer asks for their estimate to be sent to them, emailed, texted, or says something like "can you send this to me" or "I want to think about it, can I get this by email" — you can actually do this for real, not just promise it. Here's exactly how:
1. Let them know you can send it right now, and ask for their name, email, and phone number (explain the phone number is so they can also get a text confirmation, which is optional but recommended)
2. Collect these conversationally, one at a time is fine, don't make it feel like a rigid form
3. Once you have all three (name, email, phone) AND they've confirmed they want it sent, use the send_estimate tool with that information
4. Never claim you sent something or that "the office will send it" unless you actually call the tool — if you haven't collected all three pieces of information yet, keep gathering them naturally rather than falsely confirming a send
5. If they only want to provide email and not phone (or vice versa), gently mention both are helpful but proceed with what they're comfortable sharing

GUARDRAILS:
- NEVER quote a specific price yourself, even if asked — always say "you'll see your exact guaranteed price as you continue through the app" and gently redirect them back into the flow
- NEVER guarantee approval for FTL or Microf financing — those are third-party decisions
- Stay strictly on-topic: HVAC, the app process, financing options, equipment differences, the company's policies. Politely decline unrelated topics (general chit-chat is fine briefly, but redirect)
- If a customer seems frustrated or stuck, acknowledge it warmly and offer to explain whatever is confusing them, or remind them they can always go back a screen
- If asked something you genuinely don't know (e.g. a hyper-specific technical detail not listed here), be honest that you don't have that detail and suggest they can ask during their confirmation call with the team
- Keep responses conversational and concise — 2-4 sentences is usually enough. This is a chat, not an essay.
- Never be pushy. If someone seems hesitant, your job is to inform and reassure, not to close a sale.`
        : `Eres el Guía de Confort — un asesor virtual cálido y conocedor para Aire Azul, una empresa profesional de reemplazo de HVAC que sirve los condados de Marion, Lake, Sumter, Levy, Citrus y Alachua además de The Villages en el Centro de Florida.

TU ROL: Ayudar a los clientes a sentirse seguros e informados mientras obtienen una cotización instantánea de reemplazo de AC a través de esta aplicación, completamente sin presión de ventas.

CONTEXTO ACTUAL DEL CLIENTE (usa esto para dar respuestas específicas y relevantes):
${contextSnapshot}

DATOS CLAVE SOBRE AIRE AZUL:
- Cada cotización está garantizada por 45 días
- La instalación siempre incluye: el sistema, plataforma de concreto, líneas de cobre nuevas, clips de huracán, interruptor flotante, luz UV, bastidor de filtro de 2 pulgadas, toda la mano de obra, todos los permisos, y retiro del sistema antiguo
- Cada hogar recibe una Garantía de Partes Limitada de 10 años — requerido por la ley de Florida
- Algunos sistemas también tienen una "Garantía de Calidad" del fabricante, y los términos exactos difieren según la marca:
  -- Marcas NORTEK (incluyendo Frigidaire y otras bajo el grupo Nortek): Si el compresor falla dentro del período indicado (1, 5 o 10 años según el modelo), el cliente elige entre un compresor de reemplazo nuevo O el reemplazo completo de la unidad exterior/condensador, sin costo. Esto excluye daños por abuso, negligencia o desastre natural.
  -- GOODMAN (solo modelos premium selectos, llamada "Garantía Limitada de Compresor de Por Vida"): Cubre SOLO EL COMPRESOR mientras el comprador ORIGINAL Y REGISTRADO sea propietario y resida en el hogar donde se instaló. Tres detalles críticos: (1) NO se transfiere a un nuevo propietario si se vende la casa, (2) REQUIERE registro del producto con Goodman para activarse, y (3) todos los DEMÁS componentes tienen la Garantía Limitada de Partes estándar de 10 años, no de por vida. Nunca uses la palabra "de por vida" sin aclarar estas condiciones si se pregunta sobre un sistema Goodman específicamente. TRANQUILIDAD IMPORTANTE: Air-Care Connect registra cada sistema en nombre del cliente automáticamente, sin pasos adicionales para ellos, y les enviamos una copia del certificado de registro. Esto significa que los clientes nunca tienen que preocuparse por perder la fecha límite de registro — una ventaja real que vale la pena mencionar.
- Se envían dos técnicos en cada trabajo
- Sin recargos por horas extras o fines de semana, nunca
- Se requiere un depósito del 50% para programar la instalación — EXCEPTO con financiamiento FTL o Microf
- Opciones de pago: Tarjeta de crédito/débito, transferencia bancaria ACH, financiamiento FTL, arrendamiento con opción a compra Microf
- El cliente nunca tiene que hablar con un vendedor para obtener un precio real y garantizado

CÓMO MANEJAR DUDAS Y OBJECIONES (de manera genuina, nunca como un guión manipulador):
Cuando un cliente expresa duda, usa este patrón natural de tres pasos — reconoce su sentimiento, normalízalo notando que otros se han sentido igual, luego redirige a una razón genuina de confianza:

-- "Esto parece caro": Reconoce que un nuevo sistema de AC es una inversión real y es normal sentirse así. Nota que muchos clientes se sienten igual al principio. Luego redirige al valor genuino: el precio mostrado es el precio COMPLETO instalado (sin cargos ocultos después), está garantizado por 45 días así que no hay prisa para decidir hoy, y el financiamiento con FTL o Microf puede dividir el costo en un pago mensual manejable.

-- "Quiero pensarlo": Esto es saludable y nunca debes desalentarlo. Tranquiliza al cliente de que no hay prisa dado la garantía de 45 días, y ofrece un próximo paso concreto y sin presión: pueden guardar su progreso y volver en cualquier momento, revisar los detalles del sistema de nuevo, o preguntarte cualquier duda específica que tengan ahora.

-- "Quiero obtener otras cotizaciones primero": Esto es completamente razonable. Luego destaca lo que es diferente: ya tienen un precio real, completo y garantizado sin una visita de vendedor. Si están comparando, el precio que tienen ahora está fijo por 45 días — así que son libres de comparar sin riesgo de perder esta oferta.

ENCUADRE DE URGENCIA (usar honestamente — esta es una garantía real, no presión fabricada):
La garantía de precio de 45 días es una razón genuina para actuar sin ser insistente. Puedes mencionar naturalmente que fijar el precio de hoy significa sin sorpresas después.

POSICIONAMIENTO COMPETITIVO (solo cuando sea relevante):
-- Transparencia total de precios: ven el precio real y completo antes de hablar con alguien
-- Sin visita domiciliaria obligatoria: una visita en el hogar es opcional, disponible solo si ELLOS la quieren para su tranquilidad — Air-Care Connect puede coordinarla o referirla, pero nunca es requerida
-- Privacidad en el financiamiento: pueden explorar y solicitar financiamiento en privado, sin un vendedor presente
-- La garantía de 45 días elimina la presión de las tácticas de venta tradicionales de "solo hoy"

GUÍA DE MEJORA SEER/EFICIENCIA (solo reactivo — nunca ofrecer sin que se pregunte):
Solo discute opciones de mayor SEER y ahorro de energía a largo plazo si el cliente pregunta específicamente sobre clasificaciones SEER, eficiencia, o facturas de energía. Cuando preguntan, explica genuinamente que una clasificación SEER2 más alta significa que el sistema usa menos electricidad para producir el mismo enfriamiento.

CUANDO UN CLIENTE PREGUNTA SOBRE UNA MARCA QUE NO OFRECEMOS:
Air-Care Connect elige deliberadamente y de manera selectiva qué marcas y modelos específicos ofrecer, basándose en el rendimiento real en campo, confiabilidad y disponibilidad de partes — esta lista puede cambiar durante el año según correcciones del fabricante o nuevos datos de campo. Si un cliente pregunta por qué no ofrecemos una marca específica, responde con un lenguaje calmado, seguro y sin desacreditar a nadie. Nunca menciones defectos específicos, retiros del mercado, o fallas — eso crea responsabilidad legal y no es tu rol juzgarlo. Una buena respuesta es algo como: "Elegimos selectivamente qué marcas y modelos instalamos basándonos en el rendimiento de campo y la confiabilidad, y esa selección puede cambiar durante el año. Actualmente no ofrecemos esa marca, pero con gusto le mostramos excelentes alternativas en un rango de precio similar que respaldamos completamente." Luego ofrece proactivamente ayudar a explorar las opciones que SÍ están disponibles.

OFRECER UNA VISITA A DOMICILIO EN PERSONA (para clientes que prefieren una conversación en vivo en lugar de la aplicación de autoservicio):
Algunos clientes prefieren genuinamente hablar con una persona real en su hogar antes de decidir, y eso está completamente bien. Puedes ofrecer esto de dos maneras:
1. REACTIVAMENTE: si un cliente pide directamente una visita en persona o dice algo como "preferiría que alguien viniera a verlo"
2. PROACTIVAMENTE pero con moderación: si notas duda genuina y repetida después de haber intentado el enfoque de manejo de objeciones, puedes mencionar esto suavemente como alternativa, una vez, sin ser insistente
Nunca ofrezcas esto como primera respuesta a objeciones de precio comunes.
Si un cliente quiere esto:
1. Recopila su nombre y número de teléfono (requerido para devolverle la llamada), el correo es opcional
2. Una vez que tengas nombre + teléfono Y hayan confirmado que quieren esto, usa la herramienta request_home_visit
3. Esto crea un cliente potencial real para que el equipo de oficina dé seguimiento - sé honesto en que un miembro del equipo le llamará, no que algo se programa automáticamente

ENVIAR LA COTIZACIÓN (cuando un cliente quiere que se le envíe por correo o mensaje de texto):
Si un cliente pide que su cotización se le envíe, por correo, por mensaje de texto, o dice algo como "¿puedes enviarme esto?" — puedes hacerlo realmente, no solo prometerlo. Así es exactamente:
1. Avísale que puedes enviarlo ahora mismo, y pide su nombre, correo electrónico y número de teléfono (explica que el teléfono es para que también reciba una confirmación por mensaje de texto, opcional pero recomendado)
2. Recopila esto de manera conversacional, uno a la vez está bien
3. Una vez que tengas los tres (nombre, correo, teléfono) Y hayan confirmado que quieren que se envíe, usa la herramienta send_estimate con esa información
4. Nunca afirmes que enviaste algo o que "la oficina lo enviará" a menos que realmente uses la herramienta
5. Si solo quieren proporcionar correo y no teléfono (o viceversa), menciona suavemente que ambos son útiles pero procede con lo que estén dispuestos a compartir

REGLAS:
- NUNCA cotices un precio específico tú mismo — siempre di que verán su precio garantizado exacto mientras continúan en la aplicación
- NUNCA garantices la aprobación de financiamiento FTL o Microf
- Mantente estrictamente en el tema: HVAC, el proceso de la aplicación, opciones de financiamiento, diferencias de equipos, políticas de la empresa
- Responde siempre en español
- Mantén las respuestas conversacionales y concisas — 2 a 4 oraciones generalmente es suficiente
- Nunca seas insistente`;

      const r = await fetch("/api/comfort-guide", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: sys,
          messages: next.map(m => ({ role: m.role, content: m.content })),
          tools: [...(isDuct && !ductHasQuote ? [] : [{
            name: "send_estimate",
            description: "Call this ONLY once you have collected the customer's name, email, AND phone number, AND they have clearly confirmed they want their estimate sent to them. Do not call this if any of the three fields are missing or unconfirmed.",
            input_schema: {
              type: "object",
              properties: {
                name: { type: "string", description: "Customer's full name" },
                email: { type: "string", description: "Customer's email address" },
                phone: { type: "string", description: "Customer's phone number for SMS" },
              },
              required: ["name", "email", "phone"],
            },
          }]), {
            name: "request_home_visit",
            description: "Call this ONLY once you have collected the customer's name and phone number (email optional), AND they have clearly confirmed they want a team member to schedule an in-person home visit/estimate. This is for customers who prefer a live, in-person conversation rather than continuing with the self-service app. Do not call this if name or phone is missing or unconfirmed.",
            input_schema: {
              type: "object",
              properties: {
                name: { type: "string", description: "Customer's full name" },
                phone: { type: "string", description: "Customer's phone number - required for callback" },
                email: { type: "string", description: "Customer's email address - optional" },
                notes: { type: "string", description: "Any relevant context the customer shared about why they want a visit, their availability, or specific concerns - keep brief" },
              },
              required: ["name", "phone"],
            },
          }],
        }),
      });
      const d = await r.json();

      if (d.toolUse?.name === "send_estimate") {
        const { name, email, phone } = d.toolUse.input;
        setMsgs(p => [...p, { role: "assistant", content: d.text || (lang === "es" ? "¡Perfecto! Enviando su cotización ahora..." : "Perfect! Sending your estimate now...") }]);
        if (isDuct && onDuctEmail) {
          setSendStatus("sending");
          let ok = true;
          try { await onDuctEmail({ name, email, phone, contactPref: "both" }); setSendStatus("sent"); }
          catch (e) { ok = false; setSendStatus("error"); }
          setMsgs(p => [...p, { role: "assistant", content: ok
            ? L(lang, `✅ Done! Your quote is on its way to ${email}, with a button to approve it and pick your day whenever you're ready.`, `✅ ¡Listo! Su cotización va camino a ${email}, con un botón para aprobarla y elegir su día cuando esté listo.`)
            : L(lang, "I couldn't send it just now — please try again in a moment, or use the Email This Quote button.", "No pude enviarla en este momento — intente de nuevo en un momento, o use el botón Enviar Cotización por Email.") }]);
          setBusy(false);
          return;
        }
        await sendEstimateToCustomer(name, email, phone);
        setMsgs(p => [...p, { role: "assistant", content: lang === "es"
          ? `✅ ¡Listo! Hemos enviado su cotización a ${email}${phone ? " y por mensaje de texto a " + phone : ""}.`
          : `✅ Done! We've sent your estimate to ${email}${phone ? " and via text to " + phone : ""}.` }]);
      } else if (d.toolUse?.name === "request_home_visit") {
        const { name, phone, email, notes } = d.toolUse.input;
        setMsgs(p => [...p, { role: "assistant", content: d.text || (lang === "es" ? "¡Perfecto! Enviando su solicitud ahora..." : "Perfect! Submitting your request now...") }]);
        await requestHomeVisit(name, phone, email, notes);
        setMsgs(p => [...p, { role: "assistant", content: lang === "es"
          ? `✅ ¡Listo! Un miembro de nuestro equipo le llamará pronto al ${phone} para programar su visita.`
          : `✅ Done! A team member will call you at ${phone} soon to schedule your visit.` }]);
      } else if (d.text) {
        setMsgs(p => [...p, { role: "assistant", content: d.text }]);
      } else {
        console.error("Comfort Guide error:", d.error);
        setMsgs(p => [...p, { role: "assistant", content: "I'm having trouble connecting right now — please try again in a moment." }]);
      }
    } catch (err) {
      console.error("Comfort Guide fetch error:", err);
      setMsgs(p => [...p, { role: "assistant", content: "Connection issue — please try again." }]);
    }
    setBusy(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", flexDirection: "column", background: C.bg, fontFamily: FONT, maxWidth: 430, margin: "0 auto" }}>
      <div style={{ background: brand.accent, color: C.white, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: SHADOW }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.blue, border: `2px solid ${C.white}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🧑‍💼</div>
          <div><div style={{ fontWeight: 900, fontSize: 16 }}>{t.cgTitle}</div><div style={{ fontSize: 11, opacity: 0.9 }}>{brand.name}</div></div>
        </div>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: `2px solid ${C.white}`, color: C.white, borderRadius: "50%", width: 34, height: 34, cursor: "pointer", fontSize: 16, fontWeight: 900, fontFamily: FONT }}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "82%", background: m.role === "user" ? C.blue : C.white, color: m.role === "user" ? C.white : C.navy, border: m.role === "user" ? `2px solid ${C.white}` : `1.5px solid ${C.gray}`, borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 14px", fontSize: 14, lineHeight: 1.6, fontWeight: 600, boxShadow: SHADOW_SM }}>{m.content}</div>
          </div>
        ))}
        {busy && <div style={{ display: "flex", justifyContent: "flex-start" }}><div style={{ background: C.white, border: `1.5px solid ${C.gray}`, borderRadius: "18px 18px 18px 4px", padding: "10px 16px", fontSize: 14, color: C.blue, fontWeight: 700, boxShadow: SHADOW_SM }}>{t.cgThinking}</div></div>}
        {sendStatus === "sending" && <div style={{ display: "flex", justifyContent: "center" }}><div style={{ background: "#f0f9ff", border: `1.5px solid ${C.blue}`, borderRadius: 12, padding: "8px 14px", fontSize: 12, color: C.blue, fontWeight: 700 }}>📤 Sending your estimate...</div></div>}
        {sendStatus === "error" && <div style={{ display: "flex", justifyContent: "center" }}><div style={{ background: "#fef2f2", border: "1.5px solid #dc2626", borderRadius: 12, padding: "8px 14px", fontSize: 12, color: "#dc2626", fontWeight: 700 }}>⚠️ There was an issue sending — please try again</div></div>}
        <div ref={endRef} />
      </div>
      <div style={{ padding: "12px 16px 20px", background: C.white, borderTop: `2px solid ${C.gray}`, display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={t.cgPlaceholder} style={{ flex: 1, border: `2px solid ${C.blue}`, borderRadius: 24, padding: "10px 16px", fontSize: 14, outline: "none", fontFamily: FONT, color: C.navy, fontWeight: 600 }} />
        <button onClick={send} disabled={busy || !input.trim()} style={{ background: C.blue, color: C.white, border: `2px solid ${C.white}`, borderRadius: 24, padding: "10px 20px", fontWeight: 900, fontSize: 14, cursor: "pointer", opacity: busy || !input.trim() ? 0.5 : 1, fontFamily: FONT }}>{t.cgSend}</button>
      </div>
    </div>
  );
}

// ── SCREEN 1: LANDING ─────────────────────────────────────────────────────────
function S1_Landing({ brand, t, onStart, onCG, onSave, onStartOver }) {
  const [modal, setModal] = useState(false);
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: FONT, maxWidth: 430, margin: "0 auto" }}>
      <div style={{ padding: "20px 20px 0", textAlign: "center" }}>
        <ShieldLogo brand={brand} size={56} />
        <h1 style={{ fontSize: 24, fontWeight: 900, color: C.navy, margin: "12px 0 0", lineHeight: 1.25 }}>{t.taglineH}</h1>
      </div>
      <HeroCard imgSrc="/family-hero.jpg">
        <div style={{ background: C.white, padding: "14px 18px" }}>
          <p style={{ margin: "0 0 10px", fontWeight: 800, color: C.navy, fontSize: 14, textAlign: "center", lineHeight: 1.5 }}>
            Answer a few simple questions and get a realistic,<br />no-pressure estimate based on your home.
          </p>
          <TrustRow items={[t.noAppt, t.noCall, t.noCommit]} />
        </div>
      </HeroCard>
      <div style={{ padding: "18px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        <BlueBtn onClick={onStart}>{t.startBtn}</BlueBtn>
        <WhiteBtn onClick={() => setModal(true)}>{t.whyDiff}</WhiteBtn>
      </div>
      <div style={{ padding: "16px 20px 28px", marginTop: "auto" }}><CGBar t={t} onClick={onCG} /></div>
      {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(22,62,100,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setModal(false)}>
          <div style={{ background: C.white, borderRadius: 24, padding: 28, maxWidth: 360, width: "100%", boxShadow: "10px 10px 30px rgba(0,0,0,0.3)", border: `2px solid ${C.blue}` }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: "0 0 16px", color: C.navy, fontSize: 20, fontWeight: 900, textAlign: "center" }}>{t.whyTitle}</h2>
            <p style={{ margin: "0 0 12px", fontSize: 14, lineHeight: 1.7, color: C.black, fontWeight: 600 }}>{t.whyP1}</p>
            <p style={{ margin: "0 0 12px", fontSize: 14, lineHeight: 1.7, color: C.black, fontWeight: 600 }}>{t.whyP2}</p>
            <p style={{ margin: "0 0 24px", fontSize: 14, lineHeight: 1.7, color: C.black, fontWeight: 600 }}>{t.whyP3}</p>
            {/* Got It advances directly to the next screen — no need to return to landing */}
            <BlueBtn onClick={onStart}>{t.gotIt} — Let's Get Started</BlueBtn>
          </div>
        </div>
      )}
    </div>
  );
}

// ── GOOGLE MAPS CONFIG ───────────────────────────────────────────────────────
const GOOGLE_MAPS_KEY = "AIzaSyCD_C5qj6KH1qDXB7r-qcubGwSyrFZ66Tk";
const STREET_VIEW_KEY = "AIzaSyBpgPG949IRv_nCoBBijWdWAwhnUrTDoLU"; 
let googleMapsLoaded = false;
let googleMapsLoading = false;
let googleMapsCallbacks = [];

function loadGoogleMaps(callback) {
  if (googleMapsLoaded) { callback(); return; }
  googleMapsCallbacks.push(callback);
  if (googleMapsLoading) return;
  googleMapsLoading = true;
  window.__googleMapsReady = () => {
    googleMapsLoaded = true;
    googleMapsCallbacks.forEach(cb => cb());
    googleMapsCallbacks = [];
  };
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places&callback=__googleMapsReady`;
  script.async = true;
  document.head.appendChild(script);
}

// ── SCREEN 2: ADDRESS ─────────────────────────────────────────────────────────
function S2_Address({ brand, t, onFound, onBack, onCG, onSave, onStartOver }) {
  const [addr, setAddr] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);
  const debounceRef = useRef(null);
  const sessionTokenRef = useRef(null);

  // Load Google Maps with new Places API
  useEffect(() => {
    const tryInit = () => {
      if (window.google?.maps?.places?.AutocompleteSuggestion) {
        setMapsReady(true);
        return true;
      }
      // Fall back to checking for old API
      if (window.google?.maps?.places) {
        setMapsReady(true);
        return true;
      }
      return false;
    };

    if (tryInit()) return;

    if (!document.getElementById("gmap-script")) {
      const script = document.createElement("script");
      script.id = "gmap-script";
      // Load with new Places API (v=beta for new API)
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places`;
      script.async = true;
      document.head.appendChild(script);
    }

    const interval = setInterval(() => {
      if (tryInit()) clearInterval(interval);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const getNewSessionToken = async () => {
    if (window.google?.maps?.places?.AutocompleteSessionToken) {
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    }
  };

  const handleInput = async (e) => {
    const val = e.target.value;
    setAddr(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val || val.length < 3 || !mapsReady) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      try {
        if (!window.google?.maps?.places?.AutocompleteService) {
          console.warn("AutocompleteService not ready");
          return;
        }
        const svc = new window.google.maps.places.AutocompleteService();
        svc.getPlacePredictions(
          { 
            input: val, 
            componentRestrictions: { country: "us" }, 
            types: ["address"],
          },
          (predictions, status) => {
            if (status === "OK" && predictions) {
              setSuggestions(predictions.map(p => ({
                placePrediction: {
                  text: { text: p.description },
                  mainText: { text: p.structured_formatting?.main_text || p.description },
                  secondaryText: { text: p.structured_formatting?.secondary_text || "" },
                  placeId: p.place_id,
                }
              })));
            } else {
              setSuggestions([]);
            }
          }
        );
      } catch(e) {
        console.warn("Autocomplete error:", e);
        setSuggestions([]);
      }
    }, 350);
  };

  const resolveSelection = async (suggestion) => {
    setSuggestions([]);
    setBusy(true);
    
    const placeId = suggestion.placePrediction?.placeId;
    const fallbackAddress = suggestion.placePrediction?.text?.text || addr;
    setAddr(fallbackAddress);

    if (!placeId || !window.google?.maps?.places?.PlacesService) {
      onFound({ ...MOCK_PROPERTY, address: fallbackAddress });
      setBusy(false);
      return;
    }

    try {
      await new Promise((resolve) => {
        const svc = new window.google.maps.places.PlacesService(document.createElement("div"));
        svc.getDetails(
          { placeId, fields: ["formatted_address", "address_components", "geometry"] },
          (place, status) => {
            if (status === "OK" && place) {
              const get = (type) => place.address_components?.find(c => c.types.includes(type))?.long_name || "";
              const getShort = (type) => place.address_components?.find(c => c.types.includes(type))?.short_name || "";
              const address = place.formatted_address || fallbackAddress;
              const city = get("locality") || get("sublocality");
              const state = getShort("administrative_area_level_1");
              const zip = get("postal_code");
              const lat = place.geometry?.location?.lat();
              const lng = place.geometry?.location?.lng();
              setAddr(address);
              onFound({ ...MOCK_PROPERTY, address, city, state, zip, lat, lng });
            } else {
              onFound({ ...MOCK_PROPERTY, address: fallbackAddress });
            }
            resolve();
          }
        );
      });
    } catch(e) {
      console.warn("Place resolution error:", e);
      onFound({ ...MOCK_PROPERTY, address: fallbackAddress });
    }
    setBusy(false);
  };

  const handleManualFind = async () => {
    if (!addr.trim()) return;
    setBusy(true);
    // Try geocoding the manually entered address
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addr)}&key=${GOOGLE_MAPS_KEY}&components=country:US`;
      const r = await fetch(url);
      const data = await r.json();
      if (data.status === "OK" && data.results[0]) {
        const result = data.results[0];
        const get = (type) => result.address_components?.find(c => c.types.includes(type))?.long_name || "";
        const getShort = (type) => result.address_components?.find(c => c.types.includes(type))?.short_name || "";
        onFound({
          ...MOCK_PROPERTY,
          address: result.formatted_address,
          city: get("locality"),
          state: getShort("administrative_area_level_1"),
          zip: get("postal_code"),
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        });
        setBusy(false);
        return;
      }
    } catch(e) { console.warn("Geocode error:", e); }
    setBusy(false);
    onFound({ ...MOCK_PROPERTY, address: addr });
  };

  // Get display text for suggestion
  const getSuggestionText = (s) => {
    const main = s.placePrediction?.mainText?.text || s.placePrediction?.text?.text || "";
    const secondary = s.placePrediction?.secondaryText?.text || "";
    return { main, secondary };
  };

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: C.navy, margin: 0 }}>{t.findHome}</h1>
      </div>
      <HeroCard imgSrc="/house-hero.jpg" overlayText={t.findHomeDesc} />
      <div style={{ padding: "18px 20px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: C.navy, letterSpacing: 2, marginBottom: 8, textAlign: "center" }}>
          📍 {t.addressLabel}
        </div>
        <div style={{ position: "relative" }}>
          <input
            value={addr}
            onChange={handleInput}
            onKeyDown={e => e.key === "Enter" && suggestions.length === 0 && handleManualFind()}
            placeholder={t.addressPlaceholder}
            autoComplete="off"
            style={{
              width: "100%", border: `2px solid ${C.blue}`,
              borderRadius: suggestions.length > 0 ? "12px 12px 0 0" : 12,
              padding: "14px 16px", fontSize: 15, outline: "none",
              fontFamily: FONT, boxSizing: "border-box", color: C.navy,
              fontWeight: 600, background: C.white, boxShadow: SHADOW_SM,
            }}
          />
          {suggestions.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 500,
              background: C.white, borderRadius: "0 0 12px 12px",
              boxShadow: SHADOW, border: `2px solid ${C.blue}`, borderTop: "none",
            }}>
              {suggestions.map((s, i) => {
                const { main, secondary } = getSuggestionText(s);
                return (
                  <button key={i}
                    onMouseDown={e => { e.preventDefault(); resolveSelection(s); }}
                    style={{
                      width: "100%", padding: "11px 16px", background: "none",
                      border: "none",
                      borderBottom: i < suggestions.length - 1 ? `1px solid ${C.gray}` : "none",
                      cursor: "pointer", textAlign: "left", fontFamily: FONT,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f0faff"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>📍 {main}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{secondary}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {!mapsReady && (
          <p style={{ fontSize: 11, color: C.blue, margin: "6px 0 0", textAlign: "center", fontWeight: 600 }}>
            ⟳ Loading address suggestions...
          </p>
        )}
        {mapsReady && addr.length >= 3 && suggestions.length === 0 && !busy && (
          <p style={{ fontSize: 11, color: "#64748b", margin: "6px 0 0", textAlign: "center", fontWeight: 600 }}>
            Include street number and city — e.g. "123 Main St, Ocala"
          </p>
        )}
        <p style={{ fontSize: 11, color: "#64748b", textAlign: "center", margin: "8px 0 0", fontWeight: 600 }}>
          📍 We serve Marion, Lake, Sumter, Levy, Citrus & Alachua Counties + The Villages
        </p>
      </div>
      <div style={{ padding: "14px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <BlueBtn onClick={handleManualFind} disabled={busy || !addr.trim()}>
          {busy ? "🔍 Finding your home..." : t.findBtn}
        </BlueBtn>
        <TrustRow items={[t.noApptShort, t.noCallShort]} />
      </div>
    </Shell>
  );
}

// ── PROPERTY APPRAISER API ───────────────────────────────────────────────────
const COUNTY_APIS = {
  marion:  { name: "Marion County", url: "https://www.mcpafl.org" },
  lake:    { name: "Lake County",   url: "https://www.lakecopropappr.com" },
  sumter:  { name: "Sumter County", url: "https://www.sumterpa.com" },
  citrus:  { name: "Citrus County", url: "https://www.pa.citrus.fl.us" },
  levy:    { name: "Levy County",   url: "https://www.levypa.com" },
  alachua: { name: "Alachua County",url: "https://www.acpafl.org" },
};

// Detect county from address string
const detectCounty = (address) => {
  const a = address.toLowerCase();
  if (a.includes("ocala") || a.includes("marion")) return "marion";
  if (a.includes("leesburg") || a.includes("clermont") || a.includes("lake county") || a.includes("tavares") || a.includes("eustis") || a.includes("mount dora")) return "lake";
  if (a.includes("bushnell") || a.includes("wildwood") || a.includes("sumter") || a.includes("the villages") || a.includes("lady lake")) return "sumter";
  if (a.includes("inverness") || a.includes("crystal river") || a.includes("citrus")) return "citrus";
  if (a.includes("bronson") || a.includes("chiefland") || a.includes("levy")) return "levy";
  if (a.includes("gainesville") || a.includes("alachua")) return "alachua";
  return null;
};

// Fetch property data from county appraiser
// Currently uses Geocoding API to get accurate location data
// Full property appraiser integration requires county-specific API keys
const fetchPropertyData = async (address, lat, lng, apiKey) => {
  try {
    // Use Google Geocoding to get precise address components
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const r = await fetch(geocodeUrl);
    const data = await r.json();

    if (data.status === "OK" && data.results[0]) {
      const result = data.results[0];
      const get = (type) => result.address_components?.find(c => c.types.includes(type))?.long_name || "";
      const getShort = (type) => result.address_components?.find(c => c.types.includes(type))?.short_name || "";

      return {
        address: result.formatted_address,
        city: get("locality") || get("sublocality"),
        state: getShort("administrative_area_level_1"),
        zip: get("postal_code"),
        county: get("administrative_area_level_2")?.replace(" County", "").toLowerCase(),
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        verified: true,
      };
    }
  } catch(e) {
    console.warn("Geocoding error:", e);
  }
  return null;
};

// ── SCREEN 3: CONFIRM HOME ────────────────────────────────────────────────────
function S3_ConfirmHome({ brand, t, lang, property, onConfirm, onEdit, onBack, onCG, onSave, onStartOver }) {
  const [propData, setPropData] = useState(property);
  const [loadingProp, setLoadingProp] = useState(true);
  const [streetViewError, setStreetViewError] = useState(false);
  const [editingSqft, setEditingSqft] = useState(false);
  const [sqftInput, setSqftInput] = useState("");

  // Street View state
  const [svUrl, setSvUrl] = useState(null);

  // Fetch Street View metadata to get correct heading toward the property
  useEffect(() => {
    if (!propData?.address && !propData?.lat) return;

    const loc = propData.lat && propData.lng
      ? `${propData.lat},${propData.lng}`
      : encodeURIComponent(propData.address);

    // Step 1: Get metadata to find nearest panorama and its heading
    fetch(`https://maps.googleapis.com/maps/api/streetview/metadata?location=${loc}&source=outdoor&key=${STREET_VIEW_KEY}`)
      .then(r => r.json())
      .then(meta => {
        if (meta.status !== "OK") {
          setStreetViewError(true);
          return;
        }

        // Step 2: If we have lat/lng of property and the pano location,
        // calculate the heading from pano toward the property
        let heading = 0;
        if (propData.lat && propData.lng && meta.location) {
          const panoLat = meta.location.lat;
          const panoLng = meta.location.lng;
          const propLat = propData.lat;
          const propLng = propData.lng;

          // Calculate bearing from street view camera toward property
          const dLng = (propLng - panoLng) * Math.PI / 180;
          const lat1 = panoLat * Math.PI / 180;
          const lat2 = propLat * Math.PI / 180;
          const y = Math.sin(dLng) * Math.cos(lat2);
          const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
          heading = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
        }

        // Step 3: Build final Street View URL with correct heading
        const panoId = meta.pano_id;
        const url = panoId
          ? `https://maps.googleapis.com/maps/api/streetview?size=600x400&pano=${panoId}&heading=${Math.round(heading)}&pitch=5&fov=90&key=${STREET_VIEW_KEY}`
          : `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${loc}&heading=${Math.round(heading)}&pitch=5&fov=90&key=${STREET_VIEW_KEY}`;

        setSvUrl(url);
      })
      .catch(() => setStreetViewError(true));
  }, [propData.lat, propData.lng, propData.address]);

  const streetViewUrl = svUrl;

  // Fetch real property data from RentCast via secure serverless function
  useEffect(() => {
    const load = async () => {
      setLoadingProp(true);
      try {
        // Send full formatted address - RentCast works best with complete address
        const fullAddress = property.address || 
          `${property.streetNumber || ''} ${property.streetName || ''}, ${property.city || ''}, ${property.state || 'FL'} ${property.zip || ''}`.trim();
        
        const params = new URLSearchParams();
        params.append('address', fullAddress);
        // Only add these if we have them AND they're not already in the address
        if (property.city && !fullAddress.includes(property.city)) params.append('city', property.city);
        if (property.state && !fullAddress.includes(property.state)) params.append('state', property.state);
        if (property.zip && !fullAddress.includes(property.zip)) params.append('zip', property.zip);

        console.log('RentCast lookup:', fullAddress);
        const r = await fetch(`/api/property?${params.toString()}`);

        if (r.ok) {
          const data = await r.json();
          // Map property type to our display values
          const typeMap = {
            'Single Family': 'Single Family Home',
            'Manufactured': 'Manufactured Home',
            'Mobile Home': 'Manufactured Home',
            'Condo': 'Condo / Apartment',
            'Townhouse': 'Townhouse',
            'Multi Family': 'Multi-Family',
          };
          const mappedType = typeMap[data.propertyType] || data.propertyType || property.type;

          setPropData(p => ({
            ...p,
            address:  data.address  || p.address,
            city:     data.city     || p.city,
            state:    data.state    || p.state,
            zip:      data.zip      || p.zip,
            county:   data.county   || p.county,
            beds:     data.beds     ?? p.beds,
            baths:    data.baths    ?? p.baths,
            sqft:     data.sqft     ?? p.sqft,
            year:     data.yearBuilt ?? p.year,
            type:     mappedType,
            stories:  data.stories  || p.stories,
            lat:      data.lat      || p.lat,
            lng:      data.lng      || p.lng,
            rentcastFound: true,
          }));
        } else {
          console.warn("RentCast lookup failed — using address data from Google");
        }
      } catch(e) {
        console.warn("Property lookup error:", e);
      }
      setLoadingProp(false);
    };
    load();
  }, [property.address]);

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: C.navy, margin: 0 }}>{t.foundHome}</h1>
      </div>


      {/* Street View — full image, NO overlay on top */}
      <div style={{ margin: "12px 20px 0", borderRadius: 20, overflow: "hidden", boxShadow: SHADOW }}>
        {/* Image */}
        <div style={{ height: 240, background: "linear-gradient(135deg,#64748b,#334155)" }}>
          {streetViewUrl && !streetViewError ? (
            <img
              src={streetViewUrl}
              alt="Street view of property"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={() => setStreetViewError(true)}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 56 }}>🏠</span>
              <span style={{ color: C.gray, fontSize: 12, fontWeight: 600 }}>Street view not available</span>
            </div>
          )}
        </div>
        {/* Stats bar — sits BELOW the image */}
        <div style={{ background: C.navy, padding: "10px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 8 }}>
            {[
              { v: propData.beds, l: t.beds, editable: false },
              { v: propData.baths, l: t.baths, editable: false },
              { v: propData.sqft?.toLocaleString(), l: t.sqft, editable: true },
            ].map(({ v, l, editable }) => (
              <div key={l}
                onClick={editable ? () => { setSqftInput(String(propData.sqft || "")); setEditingSqft(true); } : undefined}
                style={{ textAlign: "center", cursor: editable ? "pointer" : "default", position: "relative" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: C.white }}>
                  {v || "—"}{editable && <span style={{ fontSize: 11, marginLeft: 3 }}>✏️</span>}
                </div>
                <div style={{ fontSize: 11, color: C.gray, fontWeight: 700 }}>{l}</div>
              </div>
            ))}
          </div>

          {editingSqft && (
            <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: 12, padding: "12px", marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.navy, marginBottom: 6, textAlign: "center" }}>
                {lang === "es" ? "Corregir Pies Cuadrados" : "Correct Square Footage"}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={sqftInput}
                  onChange={e => setSqftInput(e.target.value.replace(/\D/g, ""))}
                  inputMode="numeric"
                  autoFocus
                  style={{ flex: 1, border: `2px solid ${C.blue}`, borderRadius: 8, padding: "8px 10px", fontSize: 14, outline: "none", fontFamily: FONT, color: C.navy, fontWeight: 700, boxSizing: "border-box" }}
                />
                <button onClick={() => {
                  const n = parseInt(sqftInput, 10);
                  if (n && n > 100 && n < 20000) {
                    setPropData(p => ({ ...p, sqft: n }));
                  }
                  setEditingSqft(false);
                }} style={{ background: C.blue, color: C.white, border: "none", borderRadius: 8, padding: "0 14px", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: FONT }}>
                  {lang === "es" ? "OK" : "OK"}
                </button>
                <button onClick={() => setEditingSqft(false)} style={{ background: "none", border: `2px solid ${C.gray}`, color: "#64748b", borderRadius: 8, padding: "0 12px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: FONT }}>
                  ✕
                </button>
              </div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ background: C.blue, color: C.white, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
              {propData.type}
            </span>
            <span style={{ background: "rgba(255,255,255,0.15)", color: C.white, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
              {t.builtIn} {propData.year}
            </span>
            {propData.county && (
              <span style={{ background: "rgba(255,255,255,0.15)", color: C.white, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                {propData.county.charAt(0).toUpperCase() + propData.county.slice(1)} County
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Address */}
      <div style={{ padding: "12px 20px 0", textAlign: "center" }}>
        <p style={{ margin: "0 0 4px", fontWeight: 900, fontSize: 15, color: C.navy }}>
          {propData.address}
        </p>
        {loadingProp && (
          <p style={{ margin: 0, fontSize: 12, color: C.blue, fontWeight: 600 }}>
            ⟳ Looking up your home details...
          </p>
        )}
        <p style={{ margin: "4px 0 0", fontWeight: 700, fontSize: 14, color: C.black, lineHeight: 1.5 }}>
          {t.confirmDesc}
        </p>
      </div>

      {/* Note about property details */}
      <div style={{ margin: "10px 20px 0", background: "#f0f9ff", borderRadius: 12, padding: "10px 14px", border: `1px solid ${C.blue}` }}>
        <p style={{ margin: 0, fontSize: 12, color: C.navy, fontWeight: 600, textAlign: "center", lineHeight: 1.5 }}>
          💡 {lang === "es"
            ? "Toque el ícono ✏️ junto a los pies cuadrados para corregirlo, o use el botón abajo si la dirección es incorrecta."
            : "Tap the ✏️ icon next to square footage to correct it, or use the button below if the address itself is wrong."}
        </p>
      </div>

      <div style={{ padding: "14px 20px 0", display: "flex", gap: 12 }}>
        <BlueBtn onClick={() => onConfirm(propData)} style={{ flex: 1 }}>{t.confirmBtn}</BlueBtn>
        <WhiteBtn onClick={onEdit} style={{ flex: 1 }}>{lang === "es" ? "Dirección Incorrecta" : "Wrong Address"}</WhiteBtn>
      </div>
      <div style={{ padding: "10px 20px 0" }}>
        <TrustRow items={[t.noApptShort, t.noCallShort]} />
      </div>
    </Shell>
  );
}

// ── SCREEN 4: INTENT ──────────────────────────────────────────────────────────
function S4_Intent({ brand, t, onSelect, onBack, onCG, onSave, onStartOver }) {
  const opts = [
    { id: "replace", label: t.replaceMain, sub: t.replaceMainSub, blue: true },
    { id: "minisplit", label: t.addRoom, sub: t.addRoomSub, blue: false },
    { id: "guide", label: t.notSure, sub: t.notSureSub, blue: true },
  ];
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 23, fontWeight: 900, color: C.navy, margin: 0 }}>{t.whatEstimate}</h1>
      </div>
      <HeroCard imgSrc="/hvac-lineup.jpg" />
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {opts.map(o => (
          <div key={o.id} style={{ textAlign: "center" }}>
            {o.blue ? <BlueBtn onClick={() => onSelect(o.id)}>{o.label}</BlueBtn> : <WhiteBtn onClick={() => onSelect(o.id)}>{o.label}</WhiteBtn>}
            <p style={{ margin: "5px 0 0", fontSize: 12, color: C.navy, fontWeight: 600 }}>{o.sub}</p>
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 20px 0" }}><TrustRow items={[t.noApptShort, t.noCallShort]} /></div>
    </Shell>
  );
}

// ── SCREEN 5: COOLING ADEQUACY ────────────────────────────────────────────────
function S5_CoolWell({ brand, t, onSelect, onBack, onCG, onSave, onStartOver }) {
  const opts = [
    { id: "yes", label: t.coolYes, blue: true },
    { id: "used_to", label: t.coolUsed, blue: false },
    { id: "struggled", label: t.coolStruggle, blue: false },
    { id: "unsure", label: t.coolNotSure, blue: false },
  ];
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave} onStartOver={onStartOver}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{t.coolWell}</h1>
      </div>
      <HeroCard imgSrc="/old-condenser.jpg" overlayText={t.coolWellDesc} />
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {opts.map(o => (
          <div key={o.id}>
            {o.blue ? <BlueBtn onClick={() => onSelect(o.id)}>{o.label}</BlueBtn> : <WhiteBtn onClick={() => onSelect(o.id)}>{o.label}</WhiteBtn>}
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 20px 0" }}><TrustRow items={[t.noApptShort, t.noCallShort]} /></div>
    </Shell>
  );
}

// ── SCREEN 6: FLOOD ZONE ──────────────────────────────────────────────────────
function S6_FloodZone({ brand, t, onSelect, onBack, onCG, onSave, onStartOver }) {
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave} onStartOver={onStartOver}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{t.floodZone}</h1>
      </div>
      <HeroCard imgSrc="/flood-stand.jpg" overlayText={t.floodDesc} />
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        <BlueBtn onClick={() => onSelect("yes")}>{t.floodYes}</BlueBtn>
        <BlueBtn onClick={() => onSelect("no")}>{t.floodNo}</BlueBtn>
        <WhiteBtn onClick={() => onSelect("unsure")}>{t.notSureShort}</WhiteBtn>
      </div>
      <div style={{ padding: "10px 20px 0" }}><TrustRow items={[t.noApptShort, t.noCallShort]} /></div>
    </Shell>
  );
}

// ── SCREEN 7: SYSTEM AGE ──────────────────────────────────────────────────────
function S7_SystemAge({ brand, t, onSelect, onBack, onCG, onSave, onStartOver }) {
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave} onStartOver={onStartOver}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 23, fontWeight: 900, color: C.navy, margin: 0 }}>{t.systemAge}</h1>
      </div>
      <HeroCard imgSrc="/tech-dataplate.jpg" overlayText={t.systemAgeDesc} />
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        <BlueBtn onClick={() => onSelect("new")}>{t.ageNew}</BlueBtn>
        <BlueBtn onClick={() => onSelect("old")}>{t.ageOld}</BlueBtn>
        <WhiteBtn onClick={() => onSelect("unsure")}>{t.notSureShort}</WhiteBtn>
      </div>
      <div style={{ padding: "10px 20px 0" }}><TrustRow items={[t.noApptShort, t.noCallShort]} /></div>
    </Shell>
  );
}

// ── SCREEN 8: HOA ─────────────────────────────────────────────────────────────
function S8_HOA({ brand, t, onSelect, onBack, onCG, onSave, onStartOver }) {
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave} onStartOver={onStartOver}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 21, fontWeight: 900, color: C.navy, margin: 0 }}>{t.hoaTitle}</h1>
      </div>
      <HeroCard imgSrc="/hoa-blocks.jpg" overlayText={t.hoaDesc} />
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        <WhiteBtn onClick={() => onSelect("yes")}>{t.hoaYes}</WhiteBtn>
        <BlueBtn onClick={() => onSelect("no")}>{t.hoaNo}</BlueBtn>
        <WhiteBtn onClick={() => onSelect("unsure")}>{t.notSureShort}</WhiteBtn>
      </div>
      <div style={{ padding: "10px 20px 0" }}><TrustRow items={[t.noApptShort, t.noCallShort]} /></div>
    </Shell>
  );
}

// ── SCREEN 9: SYSTEM TYPE ─────────────────────────────────────────────────────
function S9_SystemType({ brand, t, onSelect, onBack, onCG, onSave, onStartOver }) {
  const opts = [
    { id: "electric", label: t.sysElectric, sub: t.sysElectricSub, blue: true },
    { id: "package", label: t.sysPackage, sub: t.sysPackageSub, blue: false },
    { id: "gas", label: t.sysGas, sub: t.sysGasSub, blue: true },
  ];
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave} onStartOver={onStartOver}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 21, fontWeight: 900, color: C.navy, margin: 0 }}>{t.systemTypeTitle}</h1>
      </div>
      <HeroCard imgSrc="/goodman-trio.jpg" />
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {opts.map(o => (
          <div key={o.id} style={{ textAlign: "center" }}>
            {o.blue ? <BlueBtn onClick={() => onSelect(o.id)}>{o.label}</BlueBtn> : <WhiteBtn onClick={() => onSelect(o.id)}>{o.label}</WhiteBtn>}
            <p style={{ margin: "4px 0 0", fontSize: 12, color: C.navy, fontWeight: 600 }}>{o.sub}</p>
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 20px 0" }}><TrustRow items={[t.noApptShort, t.noCallShort]} /></div>
    </Shell>
  );
}

// ── SCREEN 10: LOADING ────────────────────────────────────────────────────────
function S10_Preparing({ brand, t, onDone, quoteReady }) {
  const [step, setStep] = useState(0);
  const bullets = [t.prepBullet1, t.prepBullet2, t.prepBullet3];

  // Animate bullets on a timer (cosmetic only)
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 900),
      setTimeout(() => setStep(2), 1900),
      setTimeout(() => setStep(3), 2900),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Only advance to next screen once the quote data has actually loaded
  // AND a minimum time has passed (so it doesn't flash too fast)
  useEffect(() => {
    const minTimeElapsed = new Promise(resolve => setTimeout(resolve, 3800));
    let cancelled = false;

    const tryAdvance = async () => {
      await minTimeElapsed;
      if (!cancelled && quoteReady) {
        onDone();
      }
    };
    tryAdvance();

    return () => { cancelled = true; };
  }, [quoteReady]);

  // Safety net: if quote isn't ready after 8 seconds, advance anyway
  // and let S11 show an error/retry state rather than hang forever
  useEffect(() => {
    const failsafe = setTimeout(() => {
      if (!quoteReady) onDone();
    }, 8000);
    return () => clearTimeout(failsafe);
  }, [quoteReady]);
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: FONT, maxWidth: 430, margin: "0 auto" }}>
      <div style={{ padding: "20px 20px 0", textAlign: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 900, color: C.blue, letterSpacing: 2, textTransform: "uppercase" }}>{brand.name}</span>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: "8px 0 0" }}>{t.preparing}</h1>
      </div>
      <HeroCard imgSrc="/package-unit.jpg" overlayText={t.preparingDesc} />
      <div style={{ padding: "24px 20px 0", display: "flex", flexDirection: "column", gap: 16 }}>
        {bullets.map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, opacity: step > i ? 1 : 0.25, transition: "opacity 0.5s", fontSize: 15, fontWeight: 700, color: C.navy }}>
            <span style={{ fontSize: 22, color: step > i ? C.blue : C.gray }}>{step > i ? "✓" : "○"}</span>{b}
          </div>
        ))}
      </div>
      <div style={{ padding: "28px 20px 0", textAlign: "center" }}>
        {step < 3 ? (
          <div>
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: `4px solid ${C.gray}`, borderTop: `4px solid ${C.blue}`, animation: "spin 1s linear infinite", margin: "0 auto" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: C.blue, fontWeight: 800, marginTop: 10, fontSize: 14 }}>{t.almostReady}</p>
          </div>
        ) : (
          <p style={{ color: C.blue, fontWeight: 900, fontSize: 16 }}>✓ Ready!</p>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SYSTEM CATALOG — read live from the contractor's Journey Systems Pricebook.
// One source of truth: prices, brand groups, favorites (Recommended) and the
// Best Value ribbon are all edited in Journey. Systems without a real price are
// never returned, so a brand appears here the moment it is priced in Journey.
// ═════════════════════════════════════════════════════════════════════════════
const CATALOG_URL = "https://gatndtsmjrxdgxquvydw.supabase.co/functions/v1/estimate-catalog";
const INSTALL_DAYS_URL = "https://gatndtsmjrxdgxquvydw.supabase.co/functions/v1/estimate-booking?action=days";

const L = (lang, en, es) => (lang === "es" ? es : en);

const FAMILY_KEYS = ["budget", "common", "trending", "premium"];
const famKey = (f) => {
  const s = String(f || "").toLowerCase();
  if (s.includes("budget")) return "budget";
  if (s.includes("common")) return "common";
  if (s.includes("trend")) return "trending";
  if (s.includes("premium")) return "premium";
  return null;
};
// "AMERICAN STANDARD" → "American Standard", "GE (LENNOX)" → "GE (Lennox)"
const brandDisplay = (b) => String(b || "").trim().split(/(\s+|\(|\))/).map(w =>
  !w.trim() || w === "(" || w === ")" ? w : w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()
).join("");
const brandKey = (b) => String(b || "").trim().toUpperCase();

const Catalog = {
  _p: null,
  load() {
    if (!this._p) {
      this._p = fetch(CATALOG_URL)
        .then(r => { if (!r.ok) throw new Error("catalog " + r.status); return r.json(); })
        .then(d => ({
          ...d,
          systems: (d.systems || []).map(s => ({
            ...s,
            size_tons: Number(s.size_tons),
            seer2: s.seer2 == null ? null : Number(s.seer2),
            installation_price: Number(s.installation_price),
            brandKey: brandKey(s.outdoor_brand),
            brandName: brandDisplay(s.outdoor_brand),
            fam: famKey(s.brand_family),
          })),
        }))
        .catch(e => { this._p = null; throw e; });
    }
    return this._p;
  },
};

// Business rules that turn the customer's answers into pricebook rows.
const Plan = {
  isApt: (homeKind) => homeKind === "apt",
  dbTypes(sysAnswer, homeKind, fam) {
    const apt = homeKind === "apt";
    if (sysAnswer === "electric") {
      if (fam === "trending") return [apt ? "Apt Side-Discharge" : "Side-Discharge"];
      if (fam) return [apt ? "Apt Split" : "Split"];
      return apt ? ["Apt Split", "Apt Side-Discharge"] : ["Split", "Side-Discharge"];
    }
    if (sysAnswer === "package") return ["Packaged"];
    if (sysAnswer === "gas") return ["Gas"];
    return ["Split"];
  },
  families: (sysAnswer) => (sysAnswer === "electric" ? FAMILY_KEYS : ["budget", "common", "premium"]),
  homeOk(row, homeKind) {
    const h = String(row.home_type || "Both").toLowerCase();
    if (h.includes("both")) return true;
    const manufOnly = h.includes("manufactured") || h.includes("mobile");
    return manufOnly ? homeKind === "mobile" : homeKind !== "mobile";
  },
  rows(systems, { sysAnswer, homeKind, fam }) {
    const types = Plan.dbTypes(sysAnswer, homeKind, fam);
    return systems.filter(r => types.includes(r.system_type) && (!fam || r.fam === fam) && Plan.homeOk(r, homeKind));
  },
  // Never undersize: use the requested size, or the next size up that this lineup offers.
  // Side-discharge systems come in whole tons.
  sized(rows, tons) {
    const target = (r) => (String(r.system_type).includes("Side-Discharge") ? Math.ceil(tons) : tons);
    const ok = rows.filter(r => r.size_tons >= target(r) - 0.001);
    if (!ok.length) return { size: null, rows: [] };
    const size = Math.min(...ok.map(r => r.size_tons));
    return { size, rows: ok.filter(r => r.size_tons === size) };
  },
  // Brands offered in one family, each with its rows at the right size.
  brands(systems, ctx, tons) {
    const fam = Plan.rows(systems, ctx);
    const byBrand = new Map();
    for (const r of fam) {
      const b = byBrand.get(r.brandKey) || { key: r.brandKey, name: r.brandName, fav: false, bestValue: false, all: [] };
      b.all.push(r);
      if (r.recommended) b.fav = true;
      if (r.best_value) b.bestValue = true;
      byBrand.set(r.brandKey, b);
    }
    const out = [];
    for (const b of byBrand.values()) {
      const { size, rows } = Plan.sized(b.all, tons);
      if (!rows.length) continue;
      out.push({ ...b, size, rows });
    }
    return out.sort((a, b) => (b.fav - a.fav) || (b.bestValue - a.bestValue) || a.name.localeCompare(b.name));
  },
  // One button per efficiency level (lowest price at each SEER2).
  seerLevels(rows) {
    const m = new Map();
    for (const r of rows) {
      const k = r.seer2 ?? 0;
      if (!m.has(k) || r.installation_price < m.get(k).installation_price) m.set(k, r);
    }
    return [...m.values()].sort((a, b) => (a.seer2 || 0) - (b.seer2 || 0));
  },
  typeLabel(row, lang) {
    const t = String(row?.system_type || "");
    if (t.includes("Side-Discharge")) return L(lang, "Side-Discharge Heat Pump", "Bomba de Calor de Descarga Lateral");
    if (t === "Packaged") return L(lang, "Package Unit", "Unidad de Paquete");
    if (t === "Gas") return L(lang, "Gas Furnace System", "Sistema de Calefacción a Gas");
    return L(lang, "Split System Heat Pump", "Bomba de Calor Dividida");
  },
  groupSubtitle(sysAnswer, fam, lang) {
    if (sysAnswer === "package") return L(lang, "Packaged Units", "Unidades de Paquete");
    if (sysAnswer === "gas") return L(lang, "Gas Furnace Systems", "Sistemas de Calefacción a Gas");
    if (fam === "trending") return L(lang, "Side-Discharge Heat Pumps", "Bombas de Calor de Descarga Lateral");
    return L(lang, "Split System Heat Pumps", "Bombas de Calor Divididas");
  },
  familyLabel(fam, lang) {
    const y = new Date().getFullYear();
    return {
      budget: L(lang, "Budget-Friendly", "Económicas"),
      common: L(lang, "Commonly Purchased", "Más Compradas"),
      trending: L(lang, `Trending in ${y}`, `Tendencia en ${y}`),
      premium: L(lang, "Premium Products", "Productos Premium"),
    }[fam];
  },
  familyHeading(fam, lang) {
    return {
      budget: L(lang, "BUDGET-MINDED", "ECONÓMICAS"),
      common: L(lang, "COMMONLY PURCHASED", "MÁS COMPRADAS"),
      trending: L(lang, "TRENDING THIS YEAR", "TENDENCIA ESTE AÑO"),
      premium: L(lang, "PREMIUM BRANDS", "MARCAS PREMIUM"),
    }[fam];
  },
  familySub(fam, lang) {
    return {
      budget: L(lang, "Reliable options designed to keep replacement costs practical.", "Opciones confiables para mantener el costo de reemplazo práctico."),
      common: L(lang, "Commonly selected brands with a strong balance of price, features, and availability.", "Marcas comúnmente elegidas con un buen balance de precio, funciones y disponibilidad."),
      trending: L(lang, "Side-discharge systems — higher efficiency, quieter, and slimmer.", "Sistemas de descarga lateral — más eficientes, silenciosos y compactos."),
      premium: L(lang, "Higher-end brand options with stronger features, efficiency choices, or warranty support.", "Marcas de gama alta con mejores funciones, eficiencia o respaldo de garantía."),
    }[fam];
  },
  tons(property, answers) {
    const sqft = Number(property?.sqft) || 0;
    const divisor = answers.homeKind === "mobile" ? 500 : 650;
    let t = Math.max(1.5, Math.ceil((sqft / divisor) * 2) / 2);
    if (answers.coolWell === "struggled") t = Math.ceil((t + 0.5) * 2) / 2;
    return t;
  },
  isRooftop: (loc) => String(loc || "").includes("rooftop"),
};

const quoteTotal = (eq, quote) => Math.round((Number(eq?.installation_price) || 0) + (Number(quote?.adderTotal) || 0));
const money = (n) => "$" + Math.round(Number(n) || 0).toLocaleString();
const guaranteeDate = (lang) => {
  const d = new Date(); d.setDate(d.getDate() + 45);
  return d.toLocaleDateString(lang === "es" ? "es-US" : "en-US", { month: "long", day: "numeric", year: "numeric" });
};

// Equipment-specific lines first, then the contractor's "Installation includes" block for
// this system type (Journey → System Estimate Setup), then warranties.
function quoteLines(eq, catalog, lang) {
  if (!eq) return [];
  const t = String(eq.system_type || "");
  const lines = [];
  const isPkg = t === "Packaged", isGas = t === "Gas";
  lines.push(`${eq.size_tons} ${L(lang, "Ton", "Ton.")}, ${eq.seer2} SEER2 ${Plan.typeLabel(eq, lang)}`);
  if (eq.ahri_ref) lines.push(`AHRI # ${eq.ahri_ref}`);
  if (isPkg) {
    if (eq.outdoor_model) lines.push(`${L(lang, "Package Unit", "Unidad de Paquete")}: ${eq.outdoor_model}`);
  } else {
    if (isGas && eq.furnace_model) lines.push(`${L(lang, "Gas Furnace", "Calefactor a Gas")}: ${eq.furnace_model}`);
    if (eq.indoor_model) lines.push(`${isGas ? L(lang, "Evaporator Coil", "Serpentín Evaporador") : L(lang, "Air Handler (AHU)", "Manejador de Aire (AHU)")}: ${eq.indoor_model}`);
    const kw = !isGas && String(eq.indoor_description || "").match(/(\d+(?:\.\d+)?)\s*-?\s*KW/i);
    if (kw) lines.push(`${kw[1]} KW ${L(lang, "Auxiliary Heat", "Calefacción Auxiliar")}`);
    if (eq.outdoor_model) lines.push(`${L(lang, "Condenser", "Condensador")}: ${eq.outdoor_model}`);
  }
  if (catalog?.thermostat) lines.push(catalog.thermostat);
  if (!isPkg && eq.lineset_requirements) lines.push(String(eq.lineset_requirements).replace(/Copper Lines\b/i, "Copper Lineset"));
  const block = catalog?.inclusions?.byType?.[t] || catalog?.inclusions?.default || "";
  block.split(/\r?\n|,/).map(s => s.trim()).filter(Boolean).forEach(s => lines.push(s));
  return lines;
}
function warrantyLines(eq, lang) {
  const out = [];
  const m = Number(eq?.manufacturer_warranty_years);
  if (m) out.push(`${m}-${L(lang, "Year Manufacturer's Warranty", "Años de Garantía del Fabricante")}`);
  const lab = Number(eq?.labor_warranty);
  if (lab) out.push(`${lab}-${L(lang, lab === 1 ? "Year Labor Warranty" : "Year Labor Warranty", "Año(s) de Garantía de Mano de Obra")}`);
  return out;
}
const eqSummary = (eq, lang = "en") => eq ? `${eq.brandName || eq.outdoor_brand} ${eq.size_tons} Ton ${eq.seer2} SEER2 ${Plan.typeLabel(eq, lang)} (AHRI ${eq.ahri_ref || "—"})` : "";

// ── BRAND TILE — blue border = our favorites (Recommended), orange = other brands ──
const ORANGE = "#C55A11";
const logoFor = (catalog, eqOrKey) => {
  const k = typeof eqOrKey === "string" ? eqOrKey : (eqOrKey?.brandKey || brandKey(eqOrKey?.outdoor_brand));
  return catalog?.logos?.[k] || null;
};

// Brand tile: the brand's logo (uploaded in Journey → Estimate App Setup) on a white card,
// or its name when no logo is uploaded. Blue border = our favorites, orange = other brands.
function BrandTile({ name, logo, fav, bestValue, selected, onClick, lang, compact, hero }) {
  const [broken, setBroken] = useState(false);
  const showLogo = logo && !broken;
  const h = hero ? 76 : compact ? 50 : 58;
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 12, background: "transparent",
      border: "none", padding: 0, cursor: onClick ? "pointer" : "default", fontFamily: FONT, textAlign: "left",
      justifyContent: hero ? "center" : "flex-start",
    }}>
      <span style={{
        flex: hero ? "0 0 82%" : compact ? "0 0 auto" : "0 0 62%", minWidth: compact ? 160 : 0, height: h, boxSizing: "border-box",
        background: C.white, border: `3px solid ${fav ? C.blue : ORANGE}`, borderRadius: 8, padding: showLogo ? "6px 12px" : "0 14px",
        display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SHADOW_SM,
      }}>
        {showLogo
          ? <img src={logo} alt={name} onError={() => setBroken(true)} style={{ maxWidth: "100%", maxHeight: h - 18, objectFit: "contain" }} />
          : <span style={{ fontWeight: 900, fontSize: hero ? 22 : compact ? 16 : 18, color: C.navy, letterSpacing: 0.5, textTransform: "uppercase", textAlign: "center" }}>{name}</span>}
      </span>
      {onClick && (
        <span aria-hidden style={{
          width: 24, height: 24, borderRadius: 6, border: `2px solid ${C.navy}`, background: selected ? C.blue : C.white,
          color: C.white, fontWeight: 900, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>{selected ? "✓" : ""}</span>
      )}
      {bestValue && !hero && (
        <span style={{
          background: "#1F5C7A", color: C.white, fontWeight: 800, fontSize: 12, padding: "6px 12px",
          borderRadius: "4px 14px 4px 14px", whiteSpace: "nowrap",
        }}>{L(lang, "Best Value", "Mejor Valor")}</span>
      )}
    </button>
  );
}

function FavLegend({ lang }) {
  return (
    <div style={{ background: "#0F2D44", color: C.white, fontWeight: 800, fontSize: 13, textAlign: "center", padding: "8px 10px", margin: "10px 0 12px", letterSpacing: 0.5 }}>
      {L(lang, "BLUE BORDER = OUR FAVORITES", "BORDE AZUL = NUESTRAS FAVORITAS")}
    </div>
  );
}

function CenteredSpinner({ text }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 40 }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", border: `4px solid ${C.gray}`, borderTop: `4px solid ${C.blue}`, animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: C.blue, fontWeight: 700 }}>{text}</p>
    </div>
  );
}

// ── NEW: WHAT TYPE OF HOME DO YOU HAVE? ───────────────────────────────────────
function S_HomeType({ brand, t, lang, detected, sub, onSelect, onBack, onCG, onSave, onStartOver }) {
  const opts = [
    ["sitebuilt", L(lang, "Site-Built Single-Family", "Casa Unifamiliar Construida en Sitio")],
    ["plex", L(lang, "Duplex, Triplex or Quad", "Dúplex, Tríplex o Cuádruplex")],
    ["mobile", L(lang, "Mobile Home", "Casa Móvil")],
    ["modular", L(lang, "Modular Home", "Casa Modular")],
    ["apt", L(lang, "Multi-Story Apt or Condo", "Apartamento o Condominio de Varios Pisos")],
    ["multistory", L(lang, "Multi-Story Single-Family", "Casa Unifamiliar de Varios Pisos")],
  ];
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave} onStartOver={onStartOver}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{L(lang, "What Type of Home Do You Have?", "¿Qué Tipo de Casa Tiene?")}</h1>
        <p style={{ fontSize: 13, color: "#64748b", margin: "8px 0 0" }}>{sub || L(lang, "Describe the type of home the unit will be cooling/heating.", "Describa el tipo de casa que la unidad enfriará/calentará.")}</p>
      </div>
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {opts.map(([id, label], i) => (
          i % 2 === 0
            ? <BlueBtn key={id} onClick={() => onSelect(id)} style={detected === id ? { outline: `3px solid ${C.navy}` } : {}}>{label}</BlueBtn>
            : <WhiteBtn key={id} onClick={() => onSelect(id)} style={detected === id ? { outline: `3px solid ${C.navy}` } : {}}>{label}</WhiteBtn>
        ))}
      </div>
      <div style={{ padding: "10px 20px 0" }}><TrustRow items={[t.noApptShort, t.noCallShort]} /></div>
    </Shell>
  );
}

// ── WHERE WILL YOUR SYSTEM BE INSTALLED? (per system type) ────────────────────
function S_InstallLocation({ brand, t, lang, systemType, onSelect, onBack, onCG, onSave, onStartOver }) {
  const ah = { attic: L(lang, "Attic", "Ático"), ceiling: L(lang, "Ceiling", "Techo Interior"), ground: L(lang, "Ground Level", "Nivel del Suelo") };
  const cond = { ground: L(lang, "Ground", "Suelo"), rooftop: L(lang, "Rooftop", "Azotea") };
  const indoor = L(lang, "Indoor", "Interior"), outdoor = L(lang, "Outdoor", "Exterior");
  let opts;
  if (systemType === "package") {
    opts = [
      ["package_ground", L(lang, "Package Unit - Ground Level", "Unidad de Paquete - Nivel del Suelo")],
      ["package_platform", L(lang, "Package Unit - Raised Platform", "Unidad de Paquete - Plataforma Elevada")],
      ["package_rooftop", L(lang, "Package Unit - Rooftop", "Unidad de Paquete - Azotea")],
    ];
  } else {
    const ahs = systemType === "gas" ? ["ground"] : ["attic", "ceiling", "ground"];
    opts = [];
    for (const a of ahs) for (const c of ["ground", "rooftop"]) opts.push([`ah_${a}_cond_${c}`, `${indoor}: ${ah[a]}  +  ${outdoor}: ${cond[c]}`]);
  }
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave} onStartOver={onStartOver}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 21, fontWeight: 900, color: C.navy, margin: 0 }}>{L(lang, "Where Will Your System Be Installed?", "¿Dónde se Instalará Su Sistema?")}</h1>
        <p style={{ fontSize: 13, color: "#64748b", margin: "8px 0 0" }}>
          {systemType === "package"
            ? L(lang, "Confirm the location of your package unit.", "Confirme la ubicación de su unidad de paquete.")
            : L(lang, "Choose where your indoor unit (air handler) and outdoor unit (condenser) will go.", "Elija dónde irá la unidad interior (manejador de aire) y la unidad exterior (condensador).")}
        </p>
      </div>
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {opts.map(([id, label], i) => (i % 2 === 0
          ? <BlueBtn key={id} onClick={() => onSelect(id)}>{label}</BlueBtn>
          : <WhiteBtn key={id} onClick={() => onSelect(id)}>{label}</WhiteBtn>))}
      </div>
      <div style={{ padding: "10px 20px 0" }}><TrustRow items={[t.noApptShort, t.noCallShort]} /></div>
    </Shell>
  );
}

function RooftopNote({ lang }) {
  return (
    <div style={{ background: "#fefce8", border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: "10px 14px", margin: "10px 0" }}>
      <p style={{ margin: 0, fontSize: 12, color: "#854d0e", fontWeight: 700, lineHeight: 1.45 }}>
        {L(lang,
          "Rooftop installs may add $800–$2,000 for crane/rigging. We'll confirm the exact amount with you for approval before delivery.",
          "Las instalaciones en azotea pueden añadir $800–$2,000 por grúa/maniobras. Confirmaremos el monto exacto con usted para su aprobación antes de la entrega.")}
      </p>
    </div>
  );
}

// ── YOUR SYSTEM RECOMMENDATIONS ───────────────────────────────────────────────
function S_Recommendation({ brand, t, lang, quote, catalog, onChooseFamily, onCG, onSave, onStartOver, onBack }) {
  const { answers, tons, adderTotal } = quote;
  const rows = Plan.rows(catalog.systems, { sysAnswer: answers.systemType, homeKind: answers.homeKind });
  const byBrand = new Map();
  rows.forEach(r => { const a = byBrand.get(r.brandKey + r.system_type) || []; a.push(r); byBrand.set(r.brandKey + r.system_type, a); });
  const prices = [];
  for (const list of byBrand.values()) Plan.sized(list, tons).rows.forEach(r => prices.push(r.installation_price + adderTotal));
  const img = answers.systemType === "gas" ? "/goodman-trio.jpg" : answers.systemType === "package" ? "/package-unit.jpg" : "/three-condensers.jpg";
  const sysLabel = answers.systemType === "gas" ? L(lang, "Gas Furnace System", "Sistema de Calefacción a Gas")
    : answers.systemType === "package" ? L(lang, "Package Unit", "Unidad de Paquete") : L(lang, "Electric Heat Pump", "Bomba de Calor Eléctrica");
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave} onStartOver={onStartOver}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{L(lang, "Your System Recommendations", "Sus Recomendaciones de Sistema")}</h1>
      </div>
      <div style={{ margin: "12px 20px 0", background: C.white, borderRadius: 20, padding: 16, boxShadow: SHADOW, border: `2px solid ${C.blue}` }}>
        <div style={{ background: C.navy, color: C.white, borderRadius: 10, padding: "8px 12px", textAlign: "center", fontWeight: 800, fontSize: 13, lineHeight: 1.35 }}>
          {L(lang, "Based upon the information you have provided, this is our Recommendation", "Según la información que nos dio, esta es nuestra Recomendación")}
        </div>
        <div style={{ textAlign: "center", borderBottom: `1px solid ${C.gray}`, padding: "12px 0", marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: C.blue, fontWeight: 700 }}>{L(lang, "Estimated Install Price Range", "Rango de Precio Estimado de Instalación")}</div>
          {prices.length ? (
            <div style={{ fontSize: 30, fontWeight: 900, color: C.navy }}>{money(Math.min(...prices))} – {money(Math.max(...prices))}</div>
          ) : (
            <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, marginTop: 6 }}>{L(lang, "Pricing for your home is being finalized", "Estamos finalizando el precio para su casa")}</div>
          )}
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{L(lang, "*Depends upon Brand and SEER Rating", "*Depende de la Marca y la Clasificación SEER")}</div>
        </div>
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: C.blue, fontWeight: 700 }}>{t.recommendedSystem}</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.navy }}>{tons} {L(lang, "Ton", "Toneladas")} {sysLabel}</div>
        </div>
        <p style={{ fontSize: 12, color: "#64748b", textAlign: "center", margin: "0 0 10px" }}>{t.priceRangeDesc}</p>
        {Plan.isRooftop(answers.installLocation) && <RooftopNote lang={lang} />}
        <GuaranteeBadge t={t} />
        <p style={{ fontSize: 14, fontWeight: 800, color: C.navy, textAlign: "center", margin: "12px 0 8px" }}>
          {L(lang, "Next, choose a brand family so we can show your specific options.", "Ahora, elija una familia de marcas para mostrarle sus opciones.")}
        </p>
        <img src={img} alt="" style={{ width: "100%", maxHeight: 170, objectFit: "contain" }} />
      </div>
      <div style={{ padding: "16px 20px 0" }}>
        {prices.length
          ? <BlueBtn onClick={onChooseFamily}>{t.chooseBrandFamily}</BlueBtn>
          : <BlueBtn onClick={onCG}>{L(lang, "Ask the Comfort Guide for a call-back", "Pida una llamada al Asistente")}</BlueBtn>}
      </div>
    </Shell>
  );
}

// ── CHOOSE YOUR BRAND FAMILY ──────────────────────────────────────────────────
function S_BrandFamily({ brand, t, lang, quote, catalog, onSelect, onBack, onCG, onSave, onStartOver }) {
  const { answers, tons } = quote;
  const fams = Plan.families(answers.systemType);
  const img = answers.systemType === "package" ? "/package-unit.jpg" : answers.systemType === "gas" ? "/goodman-trio.jpg" : "/three-condensers.jpg";
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave} onStartOver={onStartOver}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{t.chooseFamilyTitle}</h1>
      </div>
      <HeroCard imgSrc={img} overlayText={t.chooseFamilyDesc} />
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {fams.map((f, i) => {
          const avail = Plan.brands(catalog.systems, { sysAnswer: answers.systemType, homeKind: answers.homeKind, fam: f }, tons).length > 0;
          const Btn = i % 2 === 0 ? BlueBtn : WhiteBtn;
          return (
            <div key={f} style={{ textAlign: "center", opacity: avail ? 1 : 0.5 }}>
              <Btn onClick={() => avail && onSelect(f)} disabled={!avail}>{Plan.familyLabel(f, lang)}</Btn>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: C.navy, fontWeight: 600 }}>
                {avail ? Plan.familySub(f, lang) : L(lang, "Pricing coming soon for your home's size.", "Precios próximamente para el tamaño de su casa.")}
              </p>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

// ── CHOOSE A BRAND WITHIN THIS GROUP (choose as many as you like) ─────────────
const SIDE_DISCHARGE_INFO = {
  en: {
    title: "About Side-Discharge Systems",
    p: [
      "A side-discharge outdoor unit blows air out the side instead of straight up out of the top. Most use a variable-speed (inverter) compressor that ramps up and down to match what your home needs, instead of switching fully on and off.",
      "Why people choose them: higher SEER2 efficiency, which lowers electric bills; quieter operation; a slimmer footprint that fits narrow side yards; steadier temperatures and better humidity control. Some models qualify for utility rebates — we'll help you check.",
      "Things to know: they usually cost more up front than a standard unit, and service calls for a technician trained on inverter equipment.",
    ],
  },
  es: {
    title: "Sobre los Sistemas de Descarga Lateral",
    p: [
      "Una unidad exterior de descarga lateral expulsa el aire por el costado en lugar de hacia arriba. La mayoría usa un compresor de velocidad variable (inverter) que ajusta su potencia a lo que su casa necesita, en lugar de encenderse y apagarse por completo.",
      "Por qué la gente los elige: mayor eficiencia SEER2, que reduce la factura eléctrica; funcionamiento más silencioso; tamaño más compacto para patios laterales estrechos; temperatura más estable y mejor control de humedad. Algunos modelos califican para reembolsos de la compañía eléctrica — le ayudamos a verificar.",
      "A tener en cuenta: normalmente cuestan más al inicio que una unidad estándar, y el servicio requiere un técnico capacitado en equipos inverter.",
    ],
  },
};

function S_ChooseBrands({ brand, t, lang, quote, catalog, fam, selected, onToggle, onContinue, onBack, onCG, onSave, onStartOver }) {
  const { answers, tons } = quote;
  const [info, setInfo] = useState(false);
  const list = Plan.brands(catalog.systems, { sysAnswer: answers.systemType, homeKind: answers.homeKind, fam }, tons);
  const sel = selected || [];
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave} onStartOver={onStartOver}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.black }}>{L(lang, "Choose a Brand Within This Group", "Elija una Marca de Este Grupo")}</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: C.black, margin: "2px 0 0" }}>{Plan.familyHeading(fam, lang)}</h1>
        <div style={{ fontSize: 14, color: C.navy, fontWeight: 600 }}>{Plan.groupSubtitle(answers.systemType, fam, lang)}</div>
        <div style={{ fontSize: 13, color: C.blue, fontWeight: 700, marginTop: 2 }}>{L(lang, "Choose as many as you like", "Elija todas las que guste")}</div>
      </div>
      <div style={{ padding: "0 20px" }}>
        {fam === "trending" && (
          <div style={{ background: C.white, fontWeight: 800, fontSize: 12.5, color: C.black, textAlign: "center", padding: "10px", marginTop: 10, lineHeight: 1.4 }}>
            {L(lang, "SIDE-DISCHARGE UNITS OFFER HIGHER EFFICIENCY, SAVE ELECTRICITY, AND QUALIFY FOR SOME REBATES",
              "LAS UNIDADES DE DESCARGA LATERAL OFRECEN MAYOR EFICIENCIA, AHORRAN ELECTRICIDAD Y CALIFICAN PARA ALGUNOS REEMBOLSOS")}
          </div>
        )}
        <FavLegend lang={lang} />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map(b => (
            <BrandTile key={b.key} lang={lang} name={b.name} logo={logoFor(catalog, b.key)} fav={b.fav} bestValue={b.bestValue}
              selected={sel.includes(b.key)} onClick={() => onToggle(b.key)} />
          ))}
          {!list.length && <p style={{ textAlign: "center", color: C.navy, fontWeight: 700 }}>{L(lang, "No brands are priced for your home's size in this group yet.", "Aún no hay marcas con precio para su casa en este grupo.")}</p>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
          <BlueBtn onClick={() => onContinue(list.filter(b => sel.includes(b.key)).map(b => b.key))} disabled={!sel.some(k => list.find(b => b.key === k))}>
            {L(lang, "Show My Selected Brands", "Ver Mis Marcas Seleccionadas")} →
          </BlueBtn>
          {fam === "trending" && <WhiteBtn onClick={() => setInfo(true)}>{L(lang, "Learn More About Side-Discharge Systems", "Más Sobre los Sistemas de Descarga Lateral")}</WhiteBtn>}
        </div>
      </div>
      {info && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(22,62,100,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setInfo(false)}>
          <div style={{ background: C.white, borderRadius: 20, padding: 22, maxWidth: 380, width: "100%", border: `2px solid ${C.blue}`, maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: "0 0 12px", color: C.navy, fontSize: 19, fontWeight: 900, textAlign: "center" }}>{SIDE_DISCHARGE_INFO[lang].title}</h2>
            {SIDE_DISCHARGE_INFO[lang].p.map((p, i) => <p key={i} style={{ fontSize: 14, lineHeight: 1.6, color: C.black, fontWeight: 600, margin: "0 0 10px" }}>{p}</p>)}
            <BlueBtn onClick={() => setInfo(false)}>{t.gotIt}</BlueBtn>
          </div>
        </div>
      )}
    </Shell>
  );
}

// ── SELECTED RECOMMENDATIONS — one card per chosen brand, SEER buttons ────────
function S_SelectedRecs({ brand, t, lang, quote, catalog, fam, brandKeys, savedCount, onPick, onChangeSystem, onSavedQuotes, onBack, onCG, onSave, onStartOver }) {
  const { answers, tons } = quote;
  const list = Plan.brands(catalog.systems, { sysAnswer: answers.systemType, homeKind: answers.homeKind, fam }, tons)
    .filter(b => (brandKeys || []).includes(b.key));
  const sized = list.find(b => b.size !== tons);
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave} onStartOver={onStartOver}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: C.black, margin: 0 }}>{L(lang, "Selected Recommendations", "Recomendaciones Seleccionadas")}</h1>
        <div style={{ fontSize: 19, fontWeight: 900, color: C.black, marginTop: 4 }}>{Plan.familyHeading(fam, lang)}</div>
      </div>
      <div style={{ padding: "10px 20px 0" }}>
        {sized && (
          <div style={{ background: "#fefce8", border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: "8px 12px", marginBottom: 10, fontSize: 12, color: "#854d0e", fontWeight: 600 }}>
            {L(lang, "Where your exact size isn't offered, we show the next size up so your home is properly cooled — never smaller.",
              "Donde su tamaño exacto no está disponible, mostramos el siguiente tamaño — nunca uno menor.")}
          </div>
        )}
        {list.map(b => {
          const levels = Plan.seerLevels(b.rows);
          return (
            <div key={b.key} style={{ background: "transparent", marginBottom: 18 }}>
              <div style={{ background: C.white, borderRadius: 14, border: `2px solid ${C.blue}`, padding: 14, boxShadow: SHADOW_SM }}>
                <BrandTile lang={lang} name={b.name} logo={logoFor(catalog, b.key)} fav={b.fav} bestValue={b.bestValue} compact />
                <div style={{ color: C.blue, fontWeight: 900, fontSize: 20, marginTop: 10, lineHeight: 1.25 }}>
                  {b.size} {L(lang, "Ton", "Toneladas")} {Plan.typeLabel(b.rows[0], lang)}
                </div>
              </div>
              <div style={{ textAlign: "center", fontWeight: 800, fontSize: 14, color: C.black, margin: "12px 0 8px" }}>
                {L(lang, "Choose an Efficiency Level to See Full Details", "Elija un Nivel de Eficiencia para Ver los Detalles")}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {levels.map((r, i) => (
                  <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: "0 0 58%" }}>
                      {i % 2 === 0
                        ? <BlueBtn onClick={() => onPick(r)} style={{ padding: "10px 12px", fontSize: 14 }}>{r.seer2} SEER2</BlueBtn>
                        : <WhiteBtn onClick={() => onPick(r)} style={{ padding: "10px 12px", fontSize: 14 }}>{r.seer2} SEER2</WhiteBtn>}
                    </div>
                    <div style={{ flex: 1, textAlign: "right", fontWeight: 900, fontSize: 18, color: C.black }}>{money(quoteTotal(r, quote))}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
          {savedCount > 0 && <WhiteBtn onClick={onSavedQuotes}>{L(lang, `Your Saved Quotes (${savedCount})`, `Sus Cotizaciones Guardadas (${savedCount})`)}</WhiteBtn>}
          <BlueBtn onClick={onChangeSystem}>{L(lang, "Choose A Different System", "Elegir Otro Sistema")}</BlueBtn>
        </div>
      </div>
    </Shell>
  );
}

// ── YOUR 45-DAY GUARANTEED QUOTE (full details) ───────────────────────────────
function S_QuoteDetail({ brand, t, lang, quote, catalog, eq, saved, savedCount, onChoose, onEmail, onSaveAndMore, onSavedQuotes, onBack, onCG, onSave, onStartOver }) {
  const total = quoteTotal(eq, quote);
  const deposit = Math.round(total * 0.5);
  const monthly = Math.round(total / 60);
  const lines = quoteLines(eq, catalog, lang);
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave} onStartOver={onStartOver}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 21, fontWeight: 900, color: C.black, margin: 0 }}>{L(lang, "Your 45-Day Guaranteed Quote", "Su Cotización Garantizada por 45 Días")}</h1>
      </div>
      <div style={{ padding: "12px 20px 0" }}>
        <div style={{ background: C.white, borderRadius: 16, padding: 16, boxShadow: SHADOW, border: `2px solid ${C.blue}` }}>
          <BrandTile lang={lang} name={eq.brandName || eq.outdoor_brand} logo={logoFor(catalog, eq)} fav={eq.recommended} hero />
          {eq.best_value && <div style={{ textAlign: "center", marginTop: 8 }}><span style={{ background: "#1F5C7A", color: C.white, fontWeight: 800, fontSize: 12, padding: "4px 12px", borderRadius: "4px 14px 4px 14px" }}>{L(lang, "Best Value", "Mejor Valor")}</span></div>}
          {/* Headline: the system being quoted leads the page */}
          <div style={{ textAlign: "center", margin: "14px 0 10px", paddingBottom: 12, borderBottom: `2px solid ${C.gray}` }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: C.navy, lineHeight: 1.15 }}>
              {eq.size_tons} {L(lang, "Ton", "Toneladas")} · {eq.seer2} SEER2
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.blue, lineHeight: 1.2, marginTop: 4 }}>{Plan.typeLabel(eq, lang)}</div>
          </div>
          <div>
            {lines.slice(1).map((l, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "4px 0", fontSize: 13.5, color: C.navy, fontWeight: 600 }}>
                <span style={{ color: C.blue, fontWeight: 900 }}>✓</span>{l}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", borderTop: `1px solid ${C.gray}`, marginTop: 10, paddingTop: 10 }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: C.navy }}>{money(total)}</div>
            <div style={{ fontSize: 13, color: C.blue, fontWeight: 700 }}>{t.monthlyFrom} ${monthly}{t.perMonth}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{L(lang, "50% deposit due at scheduling", "Depósito del 50% al programar")}: {money(deposit)}</div>
          </div>
          {warrantyLines(eq, lang).map(w => (
            <div key={w} style={{ background: C.navy, color: C.white, borderRadius: 10, padding: "8px 12px", marginTop: 8, fontWeight: 800, fontSize: 13, textAlign: "center" }}>🛡️ {w}</div>
          ))}
          {eq.energy_star && <div style={{ marginTop: 8, textAlign: "center" }}><span style={{ background: "#dcfce7", color: C.green, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>⚡ {t.energyStar}</span></div>}
        </div>
        {Plan.isRooftop(quote.answers.installLocation) && <RooftopNote lang={lang} />}
        <div style={{ marginTop: 10 }}><GuaranteeBadge t={t} /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
          <BlueBtn onClick={onChoose}>{L(lang, "Choose This System", "Elegir Este Sistema")}</BlueBtn>
          <WhiteBtn onClick={onEmail}>{t.emailQuote}</WhiteBtn>
          <WhiteBtn onClick={onSaveAndMore}>{saved ? L(lang, "Saved ✓ — Make Another Choice", "Guardada ✓ — Hacer Otra Elección") : L(lang, "Save Quote & Make Another Choice", "Guardar Cotización y Hacer Otra Elección")}</WhiteBtn>
          {savedCount > 0 && <WhiteBtn onClick={onSavedQuotes}>{L(lang, `Your Saved Quotes (${savedCount})`, `Sus Cotizaciones Guardadas (${savedCount})`)}</WhiteBtn>}
        </div>
      </div>
    </Shell>
  );
}

// ── YOUR 45-DAY GUARANTEED QUOTES (saved list) ────────────────────────────────
function S_SavedQuotes({ brand, t, lang, quote, catalog, saved, onOpen, onEmail, onRemove, onMore, onBack, onCG }) {
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 21, fontWeight: 900, color: C.black, margin: 0 }}>{L(lang, "Your 45-Day Guaranteed Quotes", "Sus Cotizaciones Garantizadas por 45 Días")}</h1>
        <p style={{ fontSize: 12, color: "#64748b", margin: "6px 0 0" }}>{L(lang, "Prices guaranteed through", "Precios garantizados hasta")} {guaranteeDate(lang)}</p>
      </div>
      <div style={{ padding: "12px 20px 0" }}>
        {!saved.length && (
          <div style={{ textAlign: "center", padding: 28 }}>
            <p style={{ color: C.navy, fontWeight: 700 }}>{L(lang, "You haven't saved any quotes yet.", "Aún no ha guardado cotizaciones.")}</p>
          </div>
        )}
        {saved.map(eq => (
          <div key={eq.id} style={{ display: "flex", gap: 10, alignItems: "stretch", marginBottom: 12 }}>
            <div onClick={() => onOpen(eq)} style={{ flex: 1, background: C.white, border: `2px solid ${C.blue}`, borderRadius: 12, padding: 12, cursor: "pointer", textAlign: "center", boxShadow: SHADOW_SM }}>
              <BrandTile lang={lang} name={eq.brandName || eq.outdoor_brand} logo={logoFor(catalog, eq)} fav={eq.recommended} hero />
              <div style={{ color: C.blue, fontWeight: 800, fontSize: 14, marginTop: 6 }}>{eq.size_tons} {L(lang, "Ton", "Ton.")}, {eq.seer2} SEER2</div>
              <div style={{ color: C.blue, fontWeight: 800, fontSize: 14 }}>{Plan.typeLabel(eq, lang)}</div>
              <div style={{ fontWeight: 900, fontSize: 18, color: C.black }}>{money(quoteTotal(eq, quote))}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: 104 }}>
              <button onClick={() => onEmail(eq)} style={{ flex: 1, background: C.navy, color: C.white, border: `2px solid ${C.blue}`, borderRadius: 10, fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: FONT }}>
                {t.emailQuote}
              </button>
              <button onClick={() => onRemove(eq)} style={{ background: "none", border: "none", color: "#b91c1c", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
                {L(lang, "Remove", "Quitar")}
              </button>
            </div>
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
          <BlueBtn onClick={onMore}>{L(lang, "Make Another Choice", "Hacer Otra Elección")}</BlueBtn>
        </div>
      </div>
    </Shell>
  );
}

// ── ALMOST THERE (contact form) — "schedule" or "email" mode ──────────────────
function S_AlmostThere({ brand, t, lang, mode, initial, emailEq, summaryText, continueText, onContinue, onEmailSend, onAfterEmail, onBack, onCG, onViewTerms, onViewPrivacy }) {
  const [form, setForm] = useState({ name: initial?.name || "", email: initial?.email || "", phone: initial?.phone || "", contactPref: initial?.contactPref || "both" });
  const [state, setState] = useState(null); // null | sending | sent | error
  const [err, setErr] = useState("");
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const valid = form.name.trim() && emailOk && form.phone.replace(/\D/g, "").length >= 10;
  const inputStyle = {
    width: "100%", border: `2px solid ${C.blue}`, borderRadius: 12, padding: "13px 16px", fontSize: 15, outline: "none",
    fontFamily: FONT, boxSizing: "border-box", color: C.navy, fontWeight: 600, background: C.white, boxShadow: SHADOW_SM, marginBottom: 12,
  };
  const label = { fontSize: 11, fontWeight: 800, color: C.navy, letterSpacing: 1.5, marginBottom: 6 };
  const prefOpts = [["text", t.prefText], ["voice", t.prefVoice], ["both", t.prefBoth]];

  const sendEmail = async () => {
    if (!valid) return;
    setState("sending"); setErr("");
    try { await onEmailSend(form); setState("sent"); }
    catch (e) { setState("error"); setErr(e.message || L(lang, "Could not send — please try again.", "No se pudo enviar — intente de nuevo.")); }
  };

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: C.navy, margin: 0 }}>{t.personalTitle}</h1>
        <p style={{ fontSize: 14, color: C.navy, fontWeight: 600, margin: "6px 0 0" }}>
          {mode === "email" ? L(lang, "Where should we send your quote?", "¿A dónde enviamos su cotización?") : t.personalDesc}
        </p>
        {mode === "email" && (summaryText || emailEq) && <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>{summaryText || eqSummary(emailEq, lang)}</p>}
      </div>
      <div style={{ padding: "16px 20px 0" }}>
        {state === "sent" ? (
          <div>
            <div style={{ background: "#dcfce7", border: `2px solid ${C.green}`, borderRadius: 14, padding: 14, textAlign: "center", color: C.green, fontWeight: 800, fontSize: 15, marginBottom: 14 }}>
              ✓ {L(lang, `Quote sent to ${form.email}`, `Cotización enviada a ${form.email}`)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <BlueBtn onClick={() => onContinue(form)}>{continueText || t.continueToSchedule}</BlueBtn>
              <WhiteBtn onClick={onAfterEmail}>{L(lang, "Back to My Quotes", "Volver a Mis Cotizaciones")}</WhiteBtn>
            </div>
          </div>
        ) : (
          <>
            <div style={label}>{t.nameLabel}</div>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="John Smith" style={inputStyle} autoComplete="name" />
            <div style={label}>{t.emailLabel}</div>
            <input value={form.email} onChange={e => set("email", e.target.value)} placeholder="john@example.com" type="email" style={inputStyle} autoComplete="email" />
            <div style={label}>{t.phoneLabel}</div>
            <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(352) 555-0100" type="tel" style={inputStyle} autoComplete="tel" />
            <div style={{ fontSize: 13, fontWeight: 800, color: C.navy, marginBottom: 10 }}>{t.contactPref}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {prefOpts.map(([id, lab]) => (
                <button key={id} onClick={() => set("contactPref", id)} style={{
                  background: form.contactPref === id ? C.blue : C.white, color: form.contactPref === id ? C.white : C.blue,
                  border: `2px solid ${C.blue}`, borderRadius: 50, padding: "12px 20px", fontWeight: 800, fontSize: 14,
                  cursor: "pointer", fontFamily: FONT, boxShadow: SHADOW_SM,
                }}>{lab}</button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: "#64748b", textAlign: "center", margin: "4px 0 14px", lineHeight: 1.6 }}>
              {L(lang, "By continuing, you agree to our", "Al continuar, acepta nuestros")}{" "}
              <span onClick={onViewTerms} style={{ color: C.blue, fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>{L(lang, "Terms of Service", "Términos de Servicio")}</span>
              {" "}{L(lang, "and", "y")}{" "}
              <span onClick={onViewPrivacy} style={{ color: C.blue, fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>{L(lang, "Privacy Policy", "Política de Privacidad")}</span>.
            </p>
            {err && <p style={{ color: "#dc2626", fontSize: 13, fontWeight: 700, textAlign: "center" }}>{err}</p>}
            {mode === "email" ? (
              <BlueBtn onClick={sendEmail} disabled={!valid || state === "sending"}>
                {state === "sending" ? L(lang, "Sending…", "Enviando…") : L(lang, "Email My Quote", "Enviar Mi Cotización")}
              </BlueBtn>
            ) : (
              <BlueBtn onClick={() => valid && onContinue(form)} disabled={!valid}>{continueText || t.continueToSchedule}</BlueBtn>
            )}
            <p style={{ fontSize: 11, color: "#64748b", textAlign: "center", margin: "10px 0 0", lineHeight: 1.5 }}>
              {L(lang, "Your information is private and secure. We will never sell your data or contact you without your permission.",
                "Su información es privada y segura. Nunca venderemos sus datos ni lo contactaremos sin su permiso.")}
            </p>
          </>
        )}
      </div>
    </Shell>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MINI-SPLIT PATH — no mini-split pricing yet, so every choice ends at a
// call-back request emailed to the office.
// ═════════════════════════════════════════════════════════════════════════════
const MS_OPTIONS = [
  ["1", "1 Room (Zone)", "1 Habitación (Zona)"],
  ["2", "2 Rooms (Zones)", "2 Habitaciones (Zonas)"],
  ["3", "3 Rooms (Zones)", "3 Habitaciones (Zonas)"],
  ["4+", "4+ Rooms (Zones) (or Whole House)", "4+ Habitaciones (Zonas) (o Toda la Casa)"],
  ["garage", "Garage or Shed", "Garaje o Cobertizo"],
  ["lanai", "Enclosed Patio or Lanai", "Patio Cerrado o Lanai"],
];
const MS_ROOMS = [
  ["Bedroom", "Dormitorio"], ["Living Room", "Sala"], ["Office", "Oficina"], ["Kitchen", "Cocina"],
  ["Bonus Room / Addition", "Cuarto Extra / Ampliación"], ["Garage", "Garaje"], ["Shed / Workshop", "Cobertizo / Taller"],
  ["Enclosed Patio / Lanai", "Patio Cerrado / Lanai"], ["Other", "Otro"],
];

function S_MiniSplitStart({ brand, t, lang, onSelect, onBack, onCG, onSave, onStartOver }) {
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave} onStartOver={onStartOver}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 23, fontWeight: 900, color: C.navy, margin: 0 }}>{t.whatEstimate}</h1>
      </div>
      <HeroCard imgSrc="/family-hero.jpg" />
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {MS_OPTIONS.map(([id, en, es], i) => (i % 2 === 0
          ? <BlueBtn key={id} onClick={() => onSelect(id)}>{L(lang, en, es)}</BlueBtn>
          : <WhiteBtn key={id} onClick={() => onSelect(id)}>{L(lang, en, es)}</WhiteBtn>))}
      </div>
    </Shell>
  );
}

function S_MiniSplitRooms({ brand, t, lang, count, onContinue, onBack, onCG, onSave, onStartOver }) {
  const max = Number(count) || 1;
  const [sel, setSel] = useState([]);
  const toggle = (r) => setSel(p => p.includes(r) ? p.filter(x => x !== r) : (p.length >= max ? [...p.slice(1), r] : [...p, r]));
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave} onStartOver={onStartOver}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{L(lang, "Which Rooms?", "¿Qué Habitaciones?")}</h1>
        <p style={{ fontSize: 13, color: "#64748b", margin: "6px 0 0" }}>{L(lang, `Choose up to ${max}.`, `Elija hasta ${max}.`)}</p>
      </div>
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {MS_ROOMS.map(([en, es]) => {
          const on = sel.includes(en);
          return (
            <button key={en} onClick={() => toggle(en)} style={{
              background: on ? C.blue : C.white, color: on ? C.white : C.blue, border: `2px solid ${C.blue}`, borderRadius: 50,
              padding: "12px 20px", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: FONT, boxShadow: SHADOW_SM,
            }}>{on ? "✓ " : ""}{L(lang, en, es)}</button>
          );
        })}
        <BlueBtn onClick={() => onContinue(sel)} disabled={!sel.length} style={{ marginTop: 6 }}>{L(lang, "Continue", "Continuar")} →</BlueBtn>
      </div>
    </Shell>
  );
}

function S_MiniSplitRequest({ brand, t, lang, choice, rooms, property, onDone, onBack, onCG, onViewTerms, onViewPrivacy }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", contactPref: "both" });
  const [state, setState] = useState(null);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const valid = form.name.trim() && form.phone.replace(/\D/g, "").length >= 10;
  const multi = choice === "4+";
  const choiceLabel = (MS_OPTIONS.find(o => o[0] === choice) || [null, choice])[1];
  const inputStyle = {
    width: "100%", border: `2px solid ${C.blue}`, borderRadius: 12, padding: "13px 16px", fontSize: 15, outline: "none",
    fontFamily: FONT, boxSizing: "border-box", color: C.navy, fontWeight: 600, background: C.white, boxShadow: SHADOW_SM, marginBottom: 12,
  };
  const submit = async () => {
    if (!valid) return;
    setState("sending");
    const notes = `Mini-split request: ${choiceLabel}${rooms?.length ? " — " + rooms.join(", ") : ""}`;
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({
          lead_type: "minisplit_request", property_address: property?.address || null, customer_name: form.name,
          customer_email: form.email || null, customer_phone: form.phone, contact_preference: form.contactPref,
          notes, language: lang, lead_status: "new", organization_id: 1,
        }),
      }).catch(() => {});
      const pref = { text: "Text message", voice: "Phone call", both: "Text and phone call" }[form.contactPref];
      const r = await fetch("/api/send-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: MINISPLIT_REQUEST_EMAIL,
          subject: `Mini-Split Request — ${form.name}`,
          htmlContent: `<div style="font-family:sans-serif;max-width:520px">
            <h2 style="color:#163E64">New Mini-Split Request</h2>
            <p><strong>What:</strong> ${esc(choiceLabel)}</p>
            ${rooms?.length ? `<p><strong>Rooms:</strong> ${esc(rooms.join(", "))}</p>` : ""}
            <p><strong>Name:</strong> ${esc(form.name)}</p>
            <p><strong>Phone:</strong> ${esc(form.phone)}</p>
            ${form.email ? `<p><strong>Email:</strong> ${esc(form.email)}</p>` : ""}
            <p><strong>Contact by:</strong> ${pref}</p>
            ${property?.address ? `<p><strong>Address:</strong> ${esc(property.address)}</p>` : ""}
            ${property?.sqft ? `<p><strong>Home:</strong> ${esc(String(property.sqft))} sq ft${property.type ? " · " + esc(property.type) : ""}</p>` : ""}
            <p style="color:#64748b;font-size:13px">Submitted from the online estimate app (${lang === "es" ? "Spanish" : "English"}).</p></div>`,
        }),
      });
      if (!r.ok) throw new Error("email");
      setState("sent");
    } catch (e) { setState("error"); }
  };
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        {multi ? (
          <div style={{ fontSize: 15, fontWeight: 800, color: C.black, lineHeight: 1.45 }}>
            <p style={{ margin: "0 0 10px" }}>{L(lang, "Multi-Zone Mini-Split Systems have unique requirements that are heavily dependent upon how the home is laid out.", "Los sistemas mini-split multizona tienen requisitos únicos que dependen mucho de la distribución de la casa.")}</p>
            <p style={{ margin: "0 0 10px" }}>{L(lang, "Electrical requirements also have to be taken into account.", "También hay que considerar los requisitos eléctricos.")}</p>
            <p style={{ margin: "0 0 10px" }}>{L(lang, "Please enter your information below and tell us when best we should call you.", "Ingrese sus datos abajo y díganos cuándo es mejor llamarle.")}</p>
            <p style={{ margin: 0 }}>{L(lang, "The call will take approximately 15 minutes to complete. No obligation to purchase anything.", "La llamada dura aproximadamente 15 minutos. Sin obligación de comprar nada.")}</p>
          </div>
        ) : (
          <div style={{ fontSize: 15, fontWeight: 800, color: C.black, lineHeight: 1.45 }}>
            <h1 style={{ fontSize: 21, fontWeight: 900, color: C.navy, margin: "0 0 8px" }}>{L(lang, "Let's Talk About Your Mini-Split", "Hablemos de Su Mini-Split")}</h1>
            <p style={{ margin: 0 }}>{L(lang, "Mini-split pricing depends on the room, where the indoor and outdoor units can go, and your electrical panel. Leave your information and we'll call you — about 15 minutes, no obligation.", "El precio de un mini-split depende de la habitación, dónde pueden ir las unidades y su panel eléctrico. Deje sus datos y le llamaremos — unos 15 minutos, sin obligación.")}</p>
          </div>
        )}
      </div>
      <div style={{ padding: "16px 20px 0" }}>
        {state === "sent" ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ background: "#dcfce7", border: `2px solid ${C.green}`, borderRadius: 14, padding: 14, color: C.green, fontWeight: 800, fontSize: 15, marginBottom: 14 }}>
              ✓ {L(lang, "Thank you! We'll be in touch shortly.", "¡Gracias! Nos comunicaremos pronto.")}
            </div>
            <BlueBtn onClick={onDone}>{L(lang, "Done", "Listo")}</BlueBtn>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.navy, letterSpacing: 1.5, marginBottom: 6 }}>{t.nameLabel}</div>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="John Smith" style={inputStyle} />
            <div style={{ fontSize: 11, fontWeight: 800, color: C.navy, letterSpacing: 1.5, marginBottom: 6 }}>{t.phoneLabel}</div>
            <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(352) 555-0100" type="tel" style={inputStyle} />
            <div style={{ fontSize: 11, fontWeight: 800, color: C.navy, letterSpacing: 1.5, marginBottom: 6 }}>{t.emailLabel} ({L(lang, "optional", "opcional")})</div>
            <input value={form.email} onChange={e => set("email", e.target.value)} placeholder="john@example.com" type="email" style={inputStyle} />
            <div style={{ fontSize: 13, fontWeight: 800, color: C.navy, marginBottom: 10 }}>{L(lang, "How would you like us to contact you?", "¿Cómo prefiere que lo contactemos?")}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {[["text", t.prefText], ["voice", t.prefVoice], ["both", t.prefBoth]].map(([id, lab]) => (
                <button key={id} onClick={() => set("contactPref", id)} style={{
                  background: form.contactPref === id ? C.blue : C.white, color: form.contactPref === id ? C.white : C.blue,
                  border: `2px solid ${C.blue}`, borderRadius: 50, padding: "12px 20px", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: FONT, boxShadow: SHADOW_SM,
                }}>{lab}</button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: "#64748b", textAlign: "center", margin: "4px 0 12px" }}>
              {L(lang, "By continuing, you agree to our", "Al continuar, acepta nuestros")}{" "}
              <span onClick={onViewTerms} style={{ color: C.blue, fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>{L(lang, "Terms of Service", "Términos de Servicio")}</span>{" "}{L(lang, "and", "y")}{" "}
              <span onClick={onViewPrivacy} style={{ color: C.blue, fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>{L(lang, "Privacy Policy", "Política de Privacidad")}</span>.
            </p>
            {state === "error" && <p style={{ color: "#dc2626", fontSize: 13, fontWeight: 700, textAlign: "center" }}>{L(lang, "Something went wrong — please try again, or call us.", "Algo salió mal — intente de nuevo o llámenos.")}</p>}
            <BlueBtn onClick={submit} disabled={!valid || state === "sending"}>{state === "sending" ? L(lang, "Sending…", "Enviando…") : L(lang, "Request My Call", "Solicitar Mi Llamada")}</BlueBtn>
          </>
        )}
      </div>
    </Shell>
  );
}

const MINISPLIT_REQUEST_EMAIL = "Lloyd@Air-CareConnect.com";
const OFFICE_EMAIL = "info@air-careconnect.com";
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const rpc = async (fn, args) => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" }, body: JSON.stringify(args),
  });
  const data = await r.json().catch(() => null);
  if (!r.ok) throw new Error((data && data.message) || `${fn} failed`);
  return Array.isArray(data) ? data[0] : data;
};


// ── LEGAL DOCUMENT CONTENT ─────────────────────────────────────────────────────
const TERMS_OF_SERVICE_SECTIONS = [
  { h: "1. Acceptance of Terms", p: ["These Terms of Service (\u201CTerms\u201D) govern your use of the Air-Care Connect online estimate, scheduling, and payment tool available at systemestimate.air-careconnect.com (the \u201CService\u201D), operated by Air-Care Connect LLC (\u201CAir-Care Connect,\u201D \u201Cwe,\u201D \u201Cus,\u201D or \u201Cour\u201D). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service."] },
  { h: "2. Description of the Service", p: ["The Service allows you to enter your property address to receive an automated, instant estimate for HVAC system replacement; compare equipment options and pricing tiers; communicate with \u201CComfort Guide,\u201D an AI-assisted chat feature; make a deposit payment by card or ACH through Stripe; apply for third-party financing through FTL Finance or Microf; and schedule an installation date."] },
  { h: "3. Estimates Are Based on Available Information", p: [
    "Estimates generated by the Service are based on property data from third-party public records providers, answers you provide to qualifying questions, and your equipment selection.",
    "Air-Care Connect reserves the right to adjust a quoted price if, upon in-person inspection prior to installation, actual site conditions differ materially from the information used to generate your estimate. Any such adjustment will be communicated to you and requires your approval before work begins.",
    "Estimates are guaranteed for forty-five (45) days from the date of issuance.",
  ]},
  { h: "4. Sizing and Performance", p: ["HVAC system sizing is calculated using standard square-footage-based methods and the information you provide. Air-Care Connect is not responsible for performance issues arising from factors outside the scope of this calculation, including insulation levels, structural air infiltration, ductwork condition, window efficiency, or unusually high ceiling heights, unless a more detailed load calculation was separately performed and agreed upon in writing."] },
  { h: "5. Payments, Deposits, and Financing", p: [
    "A deposit (currently 50% of the total installation price) is required to confirm and schedule your installation date, except where you select third-party financing.",
    "Card and ACH payments are processed by Stripe, Inc. Air-Care Connect does not store your full payment card or bank account details.",
    "If you select FTL Finance or Microf financing, you will be directed to that provider's own website. Approval, terms, and conditions of any financing are determined solely by the third-party provider.",
    "Your installation date is reserved upon selection but is not final until payment, or financing approval where applicable, is completed.",
  ]},
  { h: "6. Cancellation and Refunds", p: [
    "Statutory Right to Cancel: If your purchase qualifies as a home improvement contract under Florida Statute \u00A7 520.72, you have the right to cancel by exercising your right to rescind until midnight of the third business day following execution of the contract, by giving written notice to Air-Care Connect.",
    "Air-Care Connect's Refund Policy: In addition to the statutory right above, Air-Care Connect will provide a full refund of your deposit if you cancel at least one (1) full calendar day before your scheduled installation date. Cancellations made less than one calendar day before may not be eligible for a refund, at Air-Care Connect's discretion.",
    "To cancel, contact Air-Care Connect at info@air-careconnect.com.",
  ]},
  { h: "7. Warranties", p: [
    "All installations include a ten (10) year limited parts warranty, as required under Florida law. Some equipment additionally carries a manufacturer-specific \u201CQuality Pledge\u201D as described at the time of your quote; exact terms vary by manufacturer and are disclosed prior to purchase. Air-Care Connect will register eligible equipment on your behalf where required.",
    "THESE WARRANTIES DO NOT COVER damage resulting from abuse, neglect, lack of required maintenance, unauthorized modification, or natural disaster.",
  ]},
  { h: "8. The Comfort Guide AI Assistant", p: ["Comfort Guide is an AI assistant designed to answer questions and help you take certain actions such as requesting your estimate or an in-person home visit. Comfort Guide does not have authority to bind Air-Care Connect to any price or commitment beyond what is generated through the standard estimate tool."] },
  { h: "9. Service Area", p: ["The Service is intended for properties within Marion, Lake, Sumter, Levy, Citrus, and Alachua Counties, and The Villages, in Central Florida. Submitting an address outside this area does not guarantee that service will be available."] },
  { h: "10. Limitation of Liability", p: ["THE SERVICE IS PROVIDED \u201CAS IS\u201D WITHOUT WARRANTIES OF ANY KIND REGARDING THE OPERATION OF THE WEBSITE ITSELF. AIR-CARE CONNECT'S TOTAL LIABILITY ARISING OUT OF YOUR USE OF THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU HAVE ACTUALLY PAID FOR THE INSTALLATION GIVING RISE TO THE CLAIM."] },
  { h: "11. Arbitration Agreement and Jury Trial Waiver", p: ["PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS. Any dispute arising out of these Terms or any installation shall be resolved by binding arbitration on an individual basis, rather than in court. YOU AND AIR-CARE CONNECT EACH WAIVE THE RIGHT TO A TRIAL BY JURY AND THE RIGHT TO PARTICIPATE IN A CLASS ACTION. This provision does not limit your statutory right to cancel described in Section 6."] },
  { h: "12. Third-Party Services", p: ["The Service integrates with Stripe, Twilio/SendGrid, Google Maps, RentCast, FTL Finance, Microf, and Anthropic (the AI technology underlying Comfort Guide). Your use of these features is also subject to each third party's own terms."] },
  { h: "13. Changes to These Terms", p: ["We may update these Terms from time to time. Continued use of the Service after changes are posted constitutes acceptance of the revised Terms."] },
  { h: "14. Governing Law", p: ["These Terms are governed by the laws of the State of Florida, without regard to conflict of law principles."] },
  { h: "15. Contact Us", p: ["Air-Care Connect LLC \u2014 Email: info@air-careconnect.com"] },
];

const PRIVACY_POLICY_SECTIONS = [
  { h: "1. Information We Collect", p: ["We collect: your property address and associated public property records (via RentCast); answers to qualifying questions about your home and system; your name, email, and phone number when provided; payment information (collected directly by Stripe \u2014 we never see your full card or bank number); messages sent to Comfort Guide; and standard technical/browser information."] },
  { h: "2. How We Use Your Information", p: ["We use your information to generate your estimate, process payment or facilitate financing, schedule and confirm installation, send confirmations, respond to Comfort Guide requests (including creating a lead record for home visit requests), and improve the tool."] },
  { h: "3. How We Share Your Information", p: [
    "We share information only as necessary to provide the Service, with: Stripe (payment processing); FTL Finance and Microf (only if you choose to apply for financing \u2014 governed by their own privacy practices); RentCast (property lookup); Google Maps Platform (address verification); Twilio and SendGrid (email/SMS delivery); and Anthropic (the AI technology powering Comfort Guide, which processes messages you send it to generate a response).",
    "We do not sell your personal information to third parties for their own marketing purposes.",
  ]},
  { h: "4. Data Retention", p: ["We retain estimate, quote, and booking information for as long as reasonably necessary to provide our services, fulfill warranty obligations (which may extend for the full warranty period, including lifetime compressor coverage on eligible systems), and comply with legal and tax recordkeeping requirements."] },
  { h: "5. Your Choices", p: ["You may use \u201CStart Over\u201D within the app at any time to clear your saved progress. You may contact info@air-careconnect.com to request access to, correction of, or deletion of your personal information, subject to legitimate recordkeeping needs. You may opt out of texts by replying STOP, and out of marketing emails via the unsubscribe link."] },
  { h: "6. Children's Privacy", p: ["The Service is intended for adults seeking HVAC services and is not directed at children. We do not knowingly collect information from children."] },
  { h: "7. Security", p: ["We use industry-standard measures including encrypted data transmission and access controls. No method of electronic storage or transmission is completely secure."] },
  { h: "8. Changes to This Policy", p: ["We may update this Privacy Policy from time to time. The \u201CLast Updated\u201D date above reflects the most recent revision."] },
  { h: "9. Contact Us", p: ["Air-Care Connect LLC \u2014 Email: info@air-careconnect.com"] },
];

function LegalDocScreen({ brand, t, title, sections, onBack, onCG }) {
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: C.navy, margin: 0 }}>{title}</h1>
        <p style={{ fontSize: 11, color: "#94a3b8", margin: "6px 0 0" }}>Last Updated: June 28, 2026</p>
      </div>
      <div style={{ padding: "16px 20px 24px", overflowY: "auto" }}>
        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 18 }}>
            <h2 style={{ fontSize: 14, fontWeight: 900, color: C.navy, marginBottom: 6 }}>{s.h}</h2>
            {s.p.map((para, j) => (
              <p key={j} style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.6, marginBottom: 8 }}>{para}</p>
            ))}
          </div>
        ))}
      </div>
    </Shell>
  );
}

// ── SCREEN 16: PERSONAL INFO ──────────────────────────────────────────────────
// ── CHECKOUT: PAYMENT METHOD SELECTION ────────────────────────────────────────
function CheckoutPayment({ brand, t, quote, selectedEq, customerInfo, onSelectMethod, onBack, onCG }) {
  const total = (selectedEq.installation_price || 0) + (quote.adderTotal || 0);
  const deposit = Math.round(total * 0.5);

  const methods = [
    { id: "card", label: t.payCard, sub: t.payCardSub, icon: "card_credit_card", deposit: deposit, blue: true },
    { id: "ach", label: t.payACH, sub: t.payACHSub, icon: "bank", deposit: deposit, blue: false },
    { id: "ftl", label: t.payFTL, sub: t.payFTLSub, icon: "doc", deposit: 0, blue: true },
    { id: "microf", label: t.payMicrof, sub: t.payMicrofSub, icon: "house_lease", deposit: 0, blue: false },
    // Affirm removed - not yet integrated with real API. Re-add once Affirm approval + API keys are in place.
  ];

  const icons = {
    card_credit_card: "\uD83D\uDCB3",
    bank: "\uD83C\uDFE6",
    doc: "\uD83D\uDCCB",
    house_lease: "\uD83C\uDFE0",
  };

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{t.paymentTitle}</h1>
        <p style={{ fontSize: 13, color: "#64748b", margin: "8px 0 0", lineHeight: 1.5 }}>{t.paymentDesc}</p>
      </div>

      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ background: C.white, borderRadius: 16, padding: 16, boxShadow: SHADOW_SM, marginBottom: 16, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>System Total</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: C.navy }}>${total.toLocaleString()}</div>
        </div>

        {methods.map(m => (
          <button key={m.id} onClick={() => onSelectMethod(m.id)} style={{
            width: "100%", background: C.white, border: `2px solid ${m.blue ? C.blue : C.gray}`,
            borderRadius: 16, padding: "16px", marginBottom: 12, cursor: "pointer",
            textAlign: "left", fontFamily: FONT, boxShadow: SHADOW_SM,
            display: "flex", alignItems: "center", gap: 14,
            transition: "transform 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = ""}
          >
            <span style={{ fontSize: 32 }}>{icons[m.icon]}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, fontSize: 15, color: C.navy }}>{m.label}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{m.sub}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: m.deposit > 0 ? C.blue : C.green, marginTop: 6 }}>
                {m.deposit > 0 ? `${t.depositDue}: $${m.deposit.toLocaleString()}` : t.noDepositDue}
              </div>
            </div>
            <span style={{ fontSize: 18, color: C.blue }}>→</span>
          </button>
        ))}
      </div>
    </Shell>
  );
}

// ── CHECKOUT: CARD OR BANK (ACH) DEPOSIT — real Stripe Payment Element ────────
// Card charges instantly. ACH uses Stripe's bank-account flow (instant bank login or
// micro-deposits); the payment shows as "processing" until the bank confirms (1–4 business days).
function CheckoutStripe({ brand, t, lang, method, deposit, customerInfo, descriptionText, titleText, onSuccess, onBack, onCG }) {
  const isAch = method === "ach";
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const mountRef = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    loadStripe(async (stripeInst) => {
      setStripe(stripeInst);
      try {
        const r = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: deposit,
            customerEmail: customerInfo?.email,
            customerName: customerInfo?.name,
            description: descriptionText || `${brand.name} - AC System Installation Deposit`,
            paymentMethodType: isAch ? "ach" : "card",
          }),
        });
        const data = await r.json();
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else setError(data.error || L(lang, "Could not start the payment. Please try again.", "No se pudo iniciar el pago. Intente de nuevo."));
      } catch (e) {
        setError(L(lang, "Could not connect to the payment processor.", "No se pudo conectar con el procesador de pagos."));
      }
    });
  }, []);

  useEffect(() => {
    if (!stripe || !clientSecret || !mountRef.current || mounted.current) return;
    mounted.current = true;
    const el = stripe.elements({ clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: C.blue } } });
    const payment = el.create("payment", {
      defaultValues: { billingDetails: { name: customerInfo?.name || "", email: customerInfo?.email || "" } },
    });
    payment.mount(mountRef.current);
    payment.on("ready", () => setReady(true));
    payment.on("change", (ev) => setError(ev.error ? ev.error.message : ""));
    setElements(el);
  }, [stripe, clientSecret]);

  const handlePay = async () => {
    if (!stripe || !elements || processing) return;
    setProcessing(true);
    setError("");
    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + "/" },
      redirect: "if_required",
    });
    if (confirmError) {
      setError(confirmError.message || t.cardDeclined);
      setProcessing(false);
      return;
    }
    const status = paymentIntent?.status || "";
    if (!["succeeded", "processing", "requires_capture"].includes(status)) {
      setError(L(lang, "The payment was not completed. Please try again.", "El pago no se completó. Intente de nuevo."));
      setProcessing(false);
      return;
    }
    setProcessing(false);
    onSuccess({ method: isAch ? "ach" : "card", intentId: paymentIntent?.id || null, status, holdHours: status === "processing" ? 96 : 0 });
  };

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{titleText || (isAch ? t.achFormTitle : t.cardFormTitle)}</h1>
        <div style={{ fontSize: 24, fontWeight: 900, color: C.blue, margin: "10px 0" }}>${deposit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
      </div>
      <div style={{ padding: "8px 20px 0" }}>
        <div style={{ background: C.white, border: `2px solid ${C.blue}`, borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: SHADOW_SM, minHeight: 50 }}>
          {!ready && !error && <div style={{ textAlign: "center", color: C.blue, fontWeight: 600, fontSize: 13 }}>{L(lang, "Loading secure payment form...", "Cargando formulario de pago seguro...")}</div>}
          <div ref={mountRef} />
        </div>
        {isAch && (
          <div style={{ background: "#f0f9ff", borderRadius: 10, padding: "10px 14px", marginBottom: 12, border: `1px solid ${C.blue}` }}>
            <p style={{ margin: 0, fontSize: 12, color: C.navy, fontWeight: 600, lineHeight: 1.5 }}>{t.achPending}</p>
          </div>
        )}
        {error && <p style={{ color: "#dc2626", fontSize: 13, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>{error}</p>}
        <BlueBtn onClick={handlePay} disabled={!ready || processing} style={{ marginTop: 8 }}>
          {processing ? t.processingPayment : `${isAch ? t.achSubmit : t.payNow} - $${deposit.toLocaleString(undefined, { minimumFractionDigits: deposit % 1 ? 2 : 0, maximumFractionDigits: 2 })}`}
        </BlueBtn>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16 }}>
          <span style={{ fontSize: 16 }}>{"🔒"}</span>
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{L(lang, "Secured by Stripe — your details are encrypted and never stored by us", "Protegido por Stripe — sus datos están cifrados y nunca los guardamos")}</span>
        </div>
      </div>
    </Shell>
  );
}

// ── CHECKOUT: FTL FINANCING BRIDGE ────────────────────────────────────────────
function CheckoutFTL({ brand, t, total, customerInfo, onSuccess, onBack, onCG }) {
  const handleContinue = () => {
    // Open FTL dealer portal in new tab - identifies Air-Care Connect as the contractor
    window.open(FTL_DEALER_LINK, "_blank", "noopener,noreferrer");
    // Move customer forward in the app while they complete the FTL application
    onSuccess({ method: "ftl", holdHours: 48 });
  };

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{"\uD83D\uDCCB"}</div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: "0 0 12px" }}>{t.ftlBridgeTitle}</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 24, maxWidth: 320 }}>{t.ftlBridgeDesc}</p>

        <div style={{ background: C.white, borderRadius: 16, padding: 16, boxShadow: SHADOW_SM, width: "100%", marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Financing Amount</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: C.navy }}>${total.toLocaleString()}</div>
        </div>

        <BlueBtn onClick={handleContinue}>{t.ftlContinue}</BlueBtn>
      </div>
    </Shell>
  );
}

// ── CHECKOUT: MICROF LEASE-TO-OWN BRIDGE ──────────────────────────────────────
function CheckoutMicrof({ brand, t, total, customerInfo, onSuccess, onBack, onCG }) {
  const handleContinue = () => {
    if (MICROF_DEALER_LINK) {
      window.open(MICROF_DEALER_LINK, "_blank", "noopener,noreferrer");
    } else {
      alert("Microf link is being renewed - please contact our office to complete your lease-to-own application.");
    }
    onSuccess({ method: "microf", holdHours: 48 });
  };

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{"\uD83C\uDFE0"}</div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: "0 0 12px" }}>{t.microfBridgeTitle}</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 24, maxWidth: 320 }}>{t.microfBridgeDesc}</p>

        <div style={{ background: C.white, borderRadius: 16, padding: 16, boxShadow: SHADOW_SM, width: "100%", marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Lease Amount</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: C.navy }}>${total.toLocaleString()}</div>
        </div>

        <BlueBtn onClick={handleContinue}>{t.microfContinue}</BlueBtn>
      </div>
    </Shell>
  );
}

// ── CHECKOUT: AFFIRM BRIDGE ───────────────────────────────────────────────────
function CheckoutAffirm({ brand, t, total, onSuccess, onBack, onCG }) {
  const monthly12 = Math.round(total / 12);
  const monthly24 = Math.round(total / 24);

  const handleContinue = () => {
    onSuccess({ method: "affirm", holdHours: 0 });
  };

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{"\uD83D\uDCC5"}</div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: "0 0 12px" }}>{t.affirmBridgeTitle}</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 20, maxWidth: 320 }}>{t.affirmBridgeDesc}</p>

        <div style={{ display: "flex", gap: 12, width: "100%", marginBottom: 24 }}>
          <div style={{ flex: 1, background: C.white, borderRadius: 16, padding: 14, boxShadow: SHADOW_SM, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>12 months</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: C.navy }}>${monthly12}/mo</div>
          </div>
          <div style={{ flex: 1, background: C.white, borderRadius: 16, padding: 14, boxShadow: SHADOW_SM, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>24 months</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: C.navy }}>${monthly24}/mo</div>
          </div>
        </div>

        <BlueBtn onClick={handleContinue}>{t.affirmContinue}</BlueBtn>
      </div>
    </Shell>
  );
}

// ── CHECKOUT: SCHEDULING CALENDAR ─────────────────────────────────────────────
function CheckoutCalendar({ brand, t, lang, paymentInfo, daysUrl, titleText, descText, noteText, onConfirm, onBack, onCG }) {
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthOffset, setMonthOffset] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Install days come from Journey: business hours, holidays, Booking Rules → Online system
        // installs (installs per day, days, minimum notice) and install jobs already on the calendar.
        const r = await fetch(daysUrl || INSTALL_DAYS_URL);
        const body = await r.json();
        const data = (Array.isArray(body?.days) ? body.days : []).map(d => ({ available_date: d.available_date, booked_slots: d.booked ?? 0, max_slots: d.max_slots ?? 1 }));
        if (data.length) {
          const first = new Date(data[0].available_date + "T00:00:00"), now0 = new Date();
          setMonthOffset(Math.max(0, (first.getFullYear() - now0.getFullYear()) * 12 + first.getMonth() - now0.getMonth()));
        }
        // Permanent rule: never show Sundays as bookable, even if one is accidentally
        // marked open in the database. day 0 = Sunday in JS Date.
        const noSundays = data.filter(d => new Date(d.available_date + "T00:00:00").getDay() !== 0);
        setAvailableDates(noSundays.filter(d => d.booked_slots < d.max_slots));
      } catch(e) {
        console.error("Calendar load error:", e);
      }
      setLoading(false);
    };
    load();
  }, []);

  // Group dates by month for display
  const now = new Date();
  const viewMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const monthDates = availableDates.filter(d => {
    const dt = new Date(d.available_date + "T00:00:00");
    return dt.getMonth() === viewMonth.getMonth() && dt.getFullYear() === viewMonth.getFullYear();
  });

  const monthName = viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{titleText || t.calendarTitle}</h1>
        <p style={{ fontSize: 13, color: "#64748b", margin: "8px 0 0" }}>{descText || t.calendarDesc}</p>
        <p style={{ fontSize: 11, color: "#94a3b8", margin: "6px 0 0", fontStyle: "italic" }}>
          {noteText || (lang === "es" ? "No se preocupe — puede cambiar o cancelar esto en cualquier momento antes de la instalación." : "Don't worry — you can change or cancel this anytime before installation day.")}
        </p>
      </div>

      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <button onClick={() => setMonthOffset(p => Math.max(0, p - 1))} disabled={monthOffset === 0}
            style={{ background: "none", border: "none", color: monthOffset === 0 ? C.gray : C.blue, fontWeight: 800, cursor: monthOffset === 0 ? "default" : "pointer", fontFamily: FONT }}>
            ← {t.prevMonth}
          </button>
          <span style={{ fontWeight: 900, color: C.navy, fontSize: 15 }}>{monthName}</span>
          <button onClick={() => setMonthOffset(p => p + 1)}
            style={{ background: "none", border: "none", color: C.blue, fontWeight: 800, cursor: "pointer", fontFamily: FONT }}>
            {t.nextMonth} →
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: `4px solid ${C.gray}`, borderTop: `4px solid ${C.blue}`, animation: "spin 1s linear infinite", margin: "0 auto" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : monthDates.length === 0 ? (
          <div style={{ textAlign: "center", padding: 32, color: "#64748b", fontWeight: 600 }}>
            {t.noSlotsAvailable}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {monthDates.map(d => {
              const dt = new Date(d.available_date + "T00:00:00");
              const isSelected = selectedDate?.available_date === d.available_date;
              return (
                <button key={d.available_date} onClick={() => setSelectedDate(d)} style={{
                  background: isSelected ? C.blue : C.white,
                  color: isSelected ? C.white : C.navy,
                  border: `2px solid ${C.blue}`, borderRadius: 14,
                  padding: "14px 10px", cursor: "pointer", fontFamily: FONT,
                  boxShadow: SHADOW_SM, textAlign: "center",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8 }}>
                    {dt.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900 }}>{dt.getDate()}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.8 }}>
                    {dt.toLocaleDateString("en-US", { month: "short" })}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {selectedDate && (
          <BlueBtn onClick={() => onConfirm(selectedDate)} style={{ marginTop: 20 }}>
            {t.confirmDate} — {new Date(selectedDate.available_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </BlueBtn>
        )}
      </div>
    </Shell>
  );
}

// ── CHECKOUT: CONFIRMATION ─────────────────────────────────────────────────────
function CheckoutConfirmation({ brand, t, bookingRef, installDate, customerInfo, titleText, descText, dateLabel, timeText, steps, onDone }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: FONT, maxWidth: 430, margin: "0 auto" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div style={{
          width: 90, height: 90, borderRadius: "50%", background: C.green,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 48, color: C.white, marginBottom: 20, boxShadow: SHADOW,
        }}>✓</div>

        <h1 style={{ fontSize: 24, fontWeight: 900, color: C.navy, margin: "0 0 8px" }}>{titleText || t.confirmationTitle}</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 24, maxWidth: 320 }}>{descText || t.confirmationDesc}</p>

        <div style={{ background: C.white, borderRadius: 16, padding: 20, boxShadow: SHADOW, width: "100%", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.gray}` }}>
            <span style={{ color: "#64748b", fontWeight: 600, fontSize: 13 }}>{t.bookingRef}</span>
            <span style={{ color: C.navy, fontWeight: 900, fontSize: 13 }}>{bookingRef}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
            <span style={{ color: "#64748b", fontWeight: 600, fontSize: 13 }}>{dateLabel || t.installDate}</span>
            <span style={{ color: C.navy, fontWeight: 900, fontSize: 13 }}>
              {new Date(installDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}{timeText ? ` · ${timeText}` : ""}
            </span>
          </div>
        </div>

        <div style={{ background: C.white, borderRadius: 16, padding: 18, boxShadow: SHADOW_SM, width: "100%", marginBottom: 24, textAlign: "left" }}>
          <div style={{ fontWeight: 900, fontSize: 14, color: C.navy, marginBottom: 10 }}>{t.whatNext}</div>
          {(steps || [t.nextStep1, t.nextStep2, t.nextStep3]).map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: C.navy, fontWeight: 600, lineHeight: 1.4 }}>
              <span style={{ color: C.blue, fontWeight: 900 }}>{i + 1}.</span>{step}
            </div>
          ))}
        </div>

        <BlueBtn onClick={onDone}>{t.backToHome}</BlueBtn>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// DUCT CLEANING & DRYER VENT CLEANING — its own path (open the app at /ducts).
// Prices come from Journey's Duct Cleaning Pricebook; the math lives in ductQuote.js
// (the same file Journey's guided duct estimate uses), so both always agree.
// ═════════════════════════════════════════════════════════════════════════════
const DUCT_DAYS_URL = INSTALL_DAYS_URL + "&kind=duct";
const money2 = (n) => "$" + (Number(n) || 0).toLocaleString("en-US", { minimumFractionDigits: (Number(n) || 0) % 1 ? 2 : 0, maximumFractionDigits: 2 });
const ductGuaranteeDays = (catalog) => Number(ductSettings(catalog?.ductSettings).guarantee_days) || 14;
const ductGuaranteeDate = (lang, days) => {
  const d = new Date(); d.setDate(d.getDate() + days);
  return d.toLocaleDateString(lang === "es" ? "es-US" : "en-US", { month: "long", day: "numeric", year: "numeric" });
};
const ductStartLabel = (catalog, lang) => {
  const st = String(ductSettings(catalog?.ductSettings).start_time || "09:00");
  const [h, m] = st.split(":").map(Number);
  const d = new Date(2000, 0, 1, h || 9, m || 0);
  return d.toLocaleTimeString(lang === "es" ? "es-US" : "en-US", { hour: "numeric", minute: "2-digit" });
};
const ductLabel = (list, id, lang) => { const r = list.find(x => x[0] === id); return r ? (lang === "es" ? r[2] : r[1]) : ""; };
// Answers → quote, using the live pricebook from the catalog.
const ductQuoteFor = (duct, catalog, lang) => buildDuctQuote(duct || {}, catalog?.ductItems || [], catalog?.ductSettings, catalog?.salesTaxRate, lang);

function S_DuctLanding({ brand, t, lang, onStart, onCG }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: FONT, maxWidth: 430, margin: "0 auto" }}>
      <div style={{ padding: "20px 20px 0", textAlign: "center" }}>
        <ShieldLogo brand={brand} size={56} />
        <h1 style={{ fontSize: 24, fontWeight: 900, color: C.navy, margin: "12px 0 0", lineHeight: 1.25 }}>
          {L(lang, "See What Duct Cleaning & Dryer Vent Cleaning Could Cost for Your Home", "Vea Cuánto Podría Costar la Limpieza de Ductos y del Ducto de Secadora en Su Casa")}
        </h1>
      </div>
      <HeroCard imgSrc="/family-hero.jpg">
        <div style={{ background: C.white, padding: "14px 18px" }}>
          <p style={{ margin: "0 0 10px", fontWeight: 800, color: C.navy, fontSize: 14, textAlign: "center", lineHeight: 1.5 }}>
            {L(lang, "Answer a few simple questions and get a guaranteed price for your home — then pick your day.", "Conteste unas preguntas sencillas y reciba un precio garantizado para su casa — y elija su día.")}
          </p>
          <TrustRow items={[t.noAppt, t.noCall, L(lang, "Nothing to pay in advance.", "Nada que pagar por adelantado.")]} />
        </div>
      </HeroCard>
      <div style={{ padding: "18px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        <BlueBtn onClick={onStart}>{L(lang, "Start My Quote", "Comenzar Mi Cotización")}</BlueBtn>
      </div>
      <div style={{ padding: "16px 20px 28px", marginTop: "auto" }}><CGBar t={t} onClick={onCG} /></div>
    </div>
  );
}

// One question, one tap.
function S_DuctChoice({ brand, t, lang, title, sub, opts, selected, onSelect, onBack, onCG, onSave, onStartOver }) {
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave} onStartOver={onStartOver}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{title}</h1>
        {sub && <p style={{ fontSize: 13, color: "#64748b", margin: "8px 0 0" }}>{sub}</p>}
      </div>
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {opts.map(([id, en, es], i) => {
          const label = lang === "es" ? es : en;
          const st = selected === id ? { outline: `3px solid ${C.navy}` } : {};
          return i % 2 === 0
            ? <BlueBtn key={id} onClick={() => onSelect(id)} style={st}>{label}</BlueBtn>
            : <WhiteBtn key={id} onClick={() => onSelect(id)} style={st}>{label}</WhiteBtn>;
        })}
      </div>
      <div style={{ padding: "10px 20px 0" }}><TrustRow items={[t.noApptShort, t.noCallShort]} /></div>
    </Shell>
  );
}

function Stepper({ value, onChange, max = 12 }) {
  const btn = (txt, fn, off) => (
    <button onClick={fn} disabled={off} style={{ width: 34, height: 34, borderRadius: "50%", border: `2px solid ${C.blue}`, background: off ? C.gray : C.white, color: C.blue, fontWeight: 900, fontSize: 18, cursor: off ? "default" : "pointer", fontFamily: FONT }}>{txt}</button>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {btn("−", () => onChange(Math.max(0, value - 1)), value <= 0)}
      <span style={{ minWidth: 22, textAlign: "center", fontWeight: 900, fontSize: 18, color: C.navy }}>{value}</span>
      {btn("+", () => onChange(Math.min(max, value + 1)), value >= max)}
    </div>
  );
}

function S_DuctRooms({ brand, t, lang, rooms, sqft, catalog, onContinue, onBack, onCG, onSave, onStartOver }) {
  const [r, setR] = useState(() => ({ ...Object.fromEntries(DUCT_ROOMS.map(([k]) => [k, 0])), ...(rooms || {}) }));
  const [sf, setSf] = useState(sqft ? String(sqft) : "");
  const supply = supplyCount(r, ductSettings(catalog?.ductSettings));
  const sfNum = Number(String(sf).replace(/\D/g, "")) || 0;
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave} onStartOver={onStartOver}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{L(lang, "How Many Rooms of Each Type Do You Have?", "¿Cuántas Habitaciones de Cada Tipo Tiene?")}</h1>
        <p style={{ fontSize: 13, color: "#64748b", margin: "8px 0 0" }}>{L(lang, "Select a number next to each room description.", "Elija un número junto a cada tipo de habitación.")}</p>
      </div>
      <div style={{ padding: "14px 20px 0" }}>
        <div style={{ background: C.white, borderRadius: 16, padding: "6px 14px", boxShadow: SHADOW_SM, border: `2px solid ${C.blue}` }}>
          {DUCT_ROOMS.map(([k, en, es], i) => (
            <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderTop: i ? `1px solid ${C.gray}` : "none" }}>
              <span style={{ fontWeight: 800, color: C.navy, fontSize: 15 }}>{lang === "es" ? es : en}</span>
              <Stepper value={r[k] || 0} onChange={v => setR(p => ({ ...p, [k]: v }))} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, fontSize: 11, fontWeight: 800, color: C.navy, letterSpacing: 1.5, marginBottom: 6 }}>{L(lang, "HEATED & COOLED SQUARE FEET", "PIES CUADRADOS CLIMATIZADOS")}</div>
        <input value={sf} onChange={e => setSf(e.target.value.replace(/[^\d,]/g, ""))} inputMode="numeric" placeholder="1,800"
          style={{ width: "100%", border: `2px solid ${C.blue}`, borderRadius: 12, padding: "12px 16px", fontSize: 16, fontFamily: FONT, boxSizing: "border-box", color: C.navy, fontWeight: 700, background: C.white, boxShadow: SHADOW_SM }} />
        <p style={{ fontSize: 11, color: "#64748b", margin: "6px 0 0" }}>{L(lang, "From public records — correct it if it's off. It sets the price for sanitizing.", "De los registros públicos — corríjalo si no es correcto. Determina el precio de la desinfección.")}</p>
        <BlueBtn onClick={() => onContinue(r, sfNum)} disabled={supply < 1} style={{ marginTop: 16 }}>{L(lang, "Continue", "Continuar")}</BlueBtn>
      </div>
    </Shell>
  );
}

function S_DuctServices({ brand, t, lang, ahu, selected, onContinue, onBack, onCG, onSave, onStartOver }) {
  const offered = offeredServices(ahu);
  const [sel, setSel] = useState(() => new Set((selected && selected.length ? selected : ["covers", "ducts"]).filter(k => offered.some(([o]) => o === k))));
  const toggle = (k) => { if (k === "covers") return; setSel(p => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n; }); };
  const chosen = [...sel].filter(k => k !== "covers");
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave} onStartOver={onStartOver}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{L(lang, "Based Upon Your Answers We Offer the Following Services", "Según Sus Respuestas Le Ofrecemos los Siguientes Servicios")}</h1>
        <p style={{ fontSize: 13, color: "#64748b", margin: "8px 0 0" }}>{L(lang, "Click each one that interests you.", "Toque cada uno que le interese.")}</p>
      </div>
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {offered.map(([k, en, es]) => {
          const on = sel.has(k) || k === "covers";
          return (
            <button key={k} onClick={() => toggle(k)} style={{
              display: "flex", alignItems: "center", gap: 12, background: on ? C.blue : C.white, color: on ? C.white : C.navy,
              border: `2px solid ${C.blue}`, borderRadius: 50, padding: "13px 20px", fontWeight: 800, fontSize: 15, fontFamily: FONT,
              cursor: k === "covers" ? "default" : "pointer", boxShadow: SHADOW_SM, textAlign: "left",
            }}>
              <span style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${on ? C.white : C.blue}`, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>{on ? "✓" : ""}</span>
              {lang === "es" ? es : en}
            </button>
          );
        })}
        {!offered.some(([k]) => k === "blower") && (
          <p style={{ fontSize: 12, color: "#64748b", margin: 0, textAlign: "center" }}>{L(lang, "Blower and coil cleaning aren't offered online when the air handler hangs from the ceiling or sits in the attic.", "La limpieza del soplador y del serpentín no se ofrece en línea cuando el manejador de aire cuelga del techo o está en el ático.")}</p>
        )}
        <p style={{ fontSize: 11.5, color: C.navy, margin: "2px 0 0", lineHeight: 1.5 }}>
          * {L(lang, "Sanitizing is done through the returns and the A/C system. People and pets don't need to leave — birds should be removed for 30 minutes.", "La desinfección se hace a través de los retornos y el sistema de A/C. Personas y mascotas no necesitan salir — las aves deben retirarse por 30 minutos.")}
        </p>
        <BlueBtn onClick={() => onContinue([...sel])} disabled={!chosen.length} style={{ marginTop: 6 }}>{L(lang, "See My Quote", "Ver Mi Cotización")}</BlueBtn>
      </div>
    </Shell>
  );
}

function S_DuctQuote({ brand, t, lang, duct, catalog, onApprove, onEdit, onEmail, onStartOver, onBack, onCG, onSave }) {
  const q = ductQuoteFor(duct, catalog, lang);
  const days = ductGuaranteeDays(catalog);
  const warranty = String(q.settings.warranty_text || "").trim();
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave} onStartOver={onStartOver}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.black, margin: 0 }}>{L(lang, `Your ${days}-Day Guaranteed Quote`, `Su Cotización Garantizada por ${days} Días`)}</h1>
        <div style={{ fontSize: 17, fontWeight: 800, color: C.blue, marginTop: 4 }}>{L(lang, "Duct Cleaning & Dryer Vent Cleaning", "Limpieza de Ductos y Ducto de Secadora")}</div>
      </div>
      <div style={{ padding: "12px 20px 0" }}>
        <div style={{ background: C.white, borderRadius: 16, padding: 16, boxShadow: SHADOW, border: `2px solid ${C.blue}` }}>
          <div style={{ fontWeight: 900, color: C.navy, fontSize: 15, marginBottom: 6 }}>{L(lang, "We will perform the following:", "Realizaremos lo siguiente:")}</div>
          <p style={{ fontSize: 12.5, color: "#334155", margin: "0 0 6px", lineHeight: 1.5 }}>{L(lang, "We will remove and clean all Supply Vents and Return Vents where possible, then replace them once the Ducts have been thoroughly cleaned.", "Retiraremos y limpiaremos todas las rejillas de suministro y de retorno donde sea posible, y las volveremos a colocar una vez que los ductos estén completamente limpios.")}</p>
          <p style={{ fontSize: 12.5, color: "#334155", margin: "0 0 10px", lineHeight: 1.5 }}>{L(lang, "We will lightly cover furniture where possible, so as to avoid any falling dust.", "Cubriremos ligeramente los muebles donde sea posible para evitar que les caiga polvo.")}</p>
          {q.lines.map((l, i) => (
            <div key={i} style={{ padding: "5px 0", borderTop: `1px solid ${C.gray}` }}>
              <div style={{ display: "flex", gap: 8, fontSize: 14, color: C.navy, fontWeight: 700 }}>
                <span style={{ color: C.blue, fontWeight: 900 }}>✓</span><span style={{ flex: 1 }}>{l.label}</span>
              </div>
              {l.group === "sanitize" && i === q.lines.findIndex(x => x.group === "sanitize") && q.settings.sanitize_note && (
                <div style={{ fontSize: 11.5, color: "#64748b", margin: "2px 0 0 22px", lineHeight: 1.4 }}>{q.settings.sanitize_note}</div>
              )}
            </div>
          ))}
          {q.needsVisit && (
            <div style={{ background: "#fefce8", border: `1.5px solid ${C.gold}`, borderRadius: 10, padding: "8px 12px", marginTop: 8, fontSize: 12.5, color: "#854d0e", fontWeight: 700 }}>
              {L(lang, "Sanitizing for a home your size is priced in person — it isn't included in the total below. We'll quote it when we call.", "La desinfección para una casa de su tamaño se cotiza en persona — no está incluida en el total. Se la cotizaremos cuando le llamemos.")}
            </div>
          )}
          <div style={{ textAlign: "center", borderTop: `2px solid ${C.gray}`, marginTop: 10, paddingTop: 10 }}>
            <div style={{ fontSize: 34, fontWeight: 900, color: C.navy }}>{money2(q.total)}</div>
            {q.tax > 0 && <div style={{ fontSize: 12, color: "#64748b" }}>{L(lang, `Includes ${money2(q.tax)} sales tax`, `Incluye ${money2(q.tax)} de impuesto`)}</div>}
            <div style={{ fontSize: 12.5, color: C.blue, fontWeight: 700, marginTop: 2 }}>{L(lang, "Nothing to pay in advance — pay on the day of service.", "Nada que pagar por adelantado — pague el día del servicio.")}</div>
          </div>
          <div style={{ background: C.navy, color: C.white, borderRadius: 10, padding: "8px 12px", marginTop: 10, fontWeight: 800, fontSize: 13, textAlign: "center" }}>
            🛡️ {warranty || L(lang, "Ask About Our Performance Warranty", "Pregunte por Nuestra Garantía de Rendimiento")}
          </div>
        </div>
        <p style={{ fontSize: 12, color: "#64748b", textAlign: "center", margin: "8px 0 0" }}>{L(lang, "Price guaranteed through", "Precio garantizado hasta")} {ductGuaranteeDate(lang, days)}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
          <BlueBtn onClick={onApprove} disabled={!q.lines.length}>{L(lang, "Approve This Quote", "Aprobar Esta Cotización")}</BlueBtn>
          <WhiteBtn onClick={onEdit}>{L(lang, "Edit Your Services", "Cambiar Sus Servicios")}</WhiteBtn>
          <WhiteBtn onClick={onEmail}>{t.emailQuote}</WhiteBtn>
          <WhiteBtn onClick={onStartOver}>{L(lang, "Start Over", "Empezar de Nuevo")}</WhiteBtn>
        </div>
      </div>
    </Shell>
  );
}

function S_DuctPay({ brand, t, lang, total, date, timeLabel, onPayNow, onPayLater, onBack, onCG }) {
  const day = new Date(date + "T00:00:00").toLocaleDateString(lang === "es" ? "es-US" : "en-US", { weekday: "long", month: "long", day: "numeric" });
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>
          {L(lang, "You can pay today or on the DAY of SERVICE, by Check, Credit Card or Cash", "Puede pagar hoy o el DÍA del SERVICIO, con Cheque, Tarjeta de Crédito o Efectivo")}
        </h1>
      </div>
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ background: C.white, borderRadius: 16, padding: 16, boxShadow: SHADOW, border: `2px solid ${C.blue}`, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 800, letterSpacing: 1 }}>{L(lang, "SERVICES TOTAL", "TOTAL DE SERVICIOS")}</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: C.navy }}>{money2(total)}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          <BlueBtn onClick={onPayLater}>{L(lang, "I'll Pay on the Day of Service", "Pagaré el Día del Servicio")}</BlueBtn>
          <p style={{ fontSize: 13, color: C.navy, fontWeight: 700, textAlign: "center", margin: "6px 0 0" }}>{L(lang, "If you wish to pay in advance by Credit Card, you may do so here:", "Si desea pagar por adelantado con Tarjeta de Crédito, puede hacerlo aquí:")}</p>
          <WhiteBtn onClick={onPayNow}>💳 {L(lang, `Pay ${money2(total)} Now by Card`, `Pagar ${money2(total)} Ahora con Tarjeta`)}</WhiteBtn>
        </div>
        <p style={{ fontSize: 14, color: C.navy, fontWeight: 800, textAlign: "center", margin: "18px 0 0", lineHeight: 1.5 }}>
          {L(lang, "We look forward to seeing you on", "Lo esperamos el")} <span style={{ color: C.blue }}>{day}</span> {L(lang, "at", "a las")} <span style={{ color: C.blue }}>{timeLabel}</span>
        </p>
      </div>
    </Shell>
  );
}

function buildDuctQuoteEmailHtml({ lang, brandName, customerName, address, q, days, links, booked, date, timeLabel, paid }) {
  const es = lang === "es";
  const rows = q.lines.map(l => `<tr><td style="padding:6px 0;border-top:1px solid #e2e8f0;color:#163E64;font-weight:700">✓ ${esc(l.label)}</td></tr>`).join("");
  const btn = (href, label, bg) => `<a href="${esc(href)}" style="display:inline-block;background:${bg};color:#fff;text-decoration:none;font-weight:800;padding:13px 26px;border-radius:40px;margin:6px">${label}</a>`;
  const when = date ? new Date(date + "T00:00:00").toLocaleDateString(es ? "es-US" : "en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "";
  return `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#CAEEFB;padding:20px">
  <div style="background:#fff;border-radius:16px;padding:22px;border:2px solid #00B0F0">
    <div style="font-size:12px;font-weight:900;color:#00B0F0;letter-spacing:2px;text-transform:uppercase;text-align:center">${esc(brandName)}</div>
    <h1 style="color:#163E64;font-size:22px;text-align:center;margin:8px 0 2px">${booked ? (es ? "Su Servicio Está Programado" : "Your Service Is Scheduled") : (es ? `Su Cotización Garantizada por ${days} Días` : `Your ${days}-Day Guaranteed Quote`)}</h1>
    <div style="text-align:center;color:#00B0F0;font-weight:800">${es ? "Limpieza de Ductos y Ducto de Secadora" : "Duct Cleaning &amp; Dryer Vent Cleaning"}</div>
    ${customerName ? `<p style="color:#163E64">${es ? "Hola" : "Hi"} ${esc(customerName)},</p>` : ""}
    ${address ? `<p style="color:#64748b;font-size:13px;margin:0 0 10px">${esc(address)}</p>` : ""}
    ${booked && when ? `<p style="background:#dcfce7;border-radius:10px;padding:10px;color:#166534;font-weight:800;text-align:center">${es ? "Lo esperamos el" : "We look forward to seeing you on"} ${esc(when)} ${es ? "a las" : "at"} ${esc(timeLabel)}</p>` : ""}
    <p style="color:#334155;font-size:13px;line-height:1.5">${es ? "Retiraremos y limpiaremos todas las rejillas de suministro y de retorno donde sea posible, y las volveremos a colocar una vez que los ductos estén completamente limpios. Cubriremos ligeramente los muebles donde sea posible." : "We will remove and clean all Supply Vents and Return Vents where possible, then replace them once the Ducts have been thoroughly cleaned. We will lightly cover furniture where possible, so as to avoid any falling dust."}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>
    ${q.notes.length ? `<p style="color:#64748b;font-size:12px">${q.notes.map(esc).join("<br>")}</p>` : ""}
    <div style="text-align:center;border-top:2px solid #D9D9D9;margin-top:10px;padding-top:10px">
      <div style="font-size:30px;font-weight:900;color:#163E64">${money2(q.total)}</div>
      ${q.tax > 0 ? `<div style="font-size:12px;color:#64748b">${es ? "Incluye" : "Includes"} ${money2(q.tax)} ${es ? "de impuesto" : "sales tax"}</div>` : ""}
      <div style="font-size:13px;color:#00B0F0;font-weight:700">${paid ? (es ? "Pagado con tarjeta — ¡gracias!" : "Paid by card — thank you!") : (es ? "Pague el día del servicio con cheque, tarjeta o efectivo." : "Pay on the day of service by check, card or cash.")}</div>
    </div>
    ${links && !booked ? `<div style="text-align:center;margin-top:16px">${btn(links.approve, es ? "Aprobar y Elegir Mi Día" : "Approve &amp; Pick My Day", "#00B0F0")}${btn(links.view, es ? "Ver Mi Cotización" : "View My Quote", "#163E64")}</div>` : ""}
    ${!booked ? `<p style="text-align:center;color:#64748b;font-size:12px">${es ? "Precio garantizado hasta" : "Price guaranteed through"} ${esc(ductGuaranteeDate(lang, days))}</p>` : ""}
  </div></div>`;
}

// ── SAVE PROGRESS MODAL ───────────────────────────────────────────────────────
function SaveProgressModal({ t, lang, customerInfo, onClose, onSaved }) {
  const [email, setEmail] = useState(customerInfo?.email || "");
  const [name, setName] = useState(customerInfo?.name || "");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!email.trim()) return;
    setSending(true);
    setError("");
    try {
      await onSaved(email.trim(), name.trim());
      setSent(true);
    } catch(e) {
      setError("Could not save — please try again.");
    }
    setSending(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(22,62,100,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div style={{ background: C.white, borderRadius: 24, padding: 28, maxWidth: 360, width: "100%", boxShadow: "10px 10px 30px rgba(0,0,0,0.3)", border: `2px solid ${C.blue}` }} onClick={e => e.stopPropagation()}>
        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: C.navy, margin: "0 0 8px" }}>{t.savedTitle}</h2>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginBottom: 20 }}>{t.savedDesc}</p>
            <BlueBtn onClick={onClose}>{lang === "es" ? "Continuar" : "Continue"}</BlueBtn>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 36, textAlign: "center", marginBottom: 8 }}>💾</div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: C.navy, margin: "0 0 8px", textAlign: "center" }}>
              {lang === "es" ? "Guardar Su Progreso" : "Save Your Progress"}
            </h2>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginBottom: 16, textAlign: "center" }}>
              {lang === "es" ? "Le enviaremos un enlace para continuar donde lo dejó, en cualquier dispositivo." : "We'll email you a link to pick up right where you left off, on any device."}
            </p>
            <input value={name} onChange={e => setName(e.target.value)} placeholder={lang === "es" ? "Su nombre (opcional)" : "Your name (optional)"}
              style={{ width: "100%", border: `2px solid ${C.blue}`, borderRadius: 10, padding: "11px 14px", fontSize: 14, outline: "none", fontFamily: FONT, marginBottom: 10, boxSizing: "border-box" }} />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder={lang === "es" ? "Su correo electrónico" : "Your email address"} type="email"
              style={{ width: "100%", border: `2px solid ${C.blue}`, borderRadius: 10, padding: "11px 14px", fontSize: 14, outline: "none", fontFamily: FONT, marginBottom: 14, boxSizing: "border-box" }} />
            {error && <p style={{ color: "#dc2626", fontSize: 12, fontWeight: 700, textAlign: "center", marginBottom: 10 }}>{error}</p>}
            <BlueBtn onClick={handleSend} disabled={!email.trim() || sending}>
              {sending ? "..." : (lang === "es" ? "Enviar Enlace" : "Send Me The Link")}
            </BlueBtn>
            <button onClick={onClose} style={{ width: "100%", background: "none", border: "none", color: "#64748b", fontSize: 12, fontWeight: 700, marginTop: 10, cursor: "pointer", fontFamily: FONT }}>
              {lang === "es" ? "Cancelar" : "Cancel"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── LANGUAGE TOGGLE ───────────────────────────────────────────────────────────
function LangToggle({ lang, setLang }) {
  return (
    <div style={{ position: "fixed", top: 14, right: 14, zIndex: 300, background: C.white, border: `2px solid ${C.blue}`, borderRadius: 50, boxShadow: SHADOW_SM, display: "flex", overflow: "hidden", fontFamily: FONT }}>
      {["en", "es"].map(l => (
        <button key={l} onClick={() => setLang(l)} style={{ padding: "7px 16px", border: "none", cursor: "pointer", fontWeight: 900, fontSize: 12, fontFamily: FONT, background: lang === l ? C.blue : "transparent", color: lang === l ? C.white : C.blue, transition: "all 0.2s", letterSpacing: 1 }}>{l.toUpperCase()}</button>
      ))}
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
// Duct cleaning lives at /ducts (also /duct-cleaning or ?service=ducts).
const startsInDuctMode = () => {
  try {
    return /^\/(ducts?|duct-cleaning)\/?$/i.test(window.location.pathname) || /^ducts?$/i.test(new URLSearchParams(window.location.search).get("service") || "");
  } catch (e) { return false; }
};

export default function App() {
  const [lang, setLang] = useState("en");
  const [mode, setMode] = useState(() => (startsInDuctMode() ? "duct" : "system"));
  const [duct, setDuct] = useState({});
  const [screen, setScreen] = useState(() => (startsInDuctMode() ? "d1" : "s1"));
  const [property, setProperty] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quote, setQuote] = useState(null);
  const [catalog, setCatalog] = useState(null);
  const [catalogError, setCatalogError] = useState(false);
  const [quoteFailed, setQuoteFailed] = useState(false);
  const [brandFamily, setBrandFamily] = useState(null);      // budget | common | trending | premium
  const [selectedBrands, setSelectedBrands] = useState([]);  // brand keys chosen on the brand page
  const [selectedEq, setSelectedEq] = useState(null);
  const [savedOptions, setSavedOptions] = useState([]);
  const [emailEq, setEmailEq] = useState(null);
  const [formMode, setFormMode] = useState("schedule");      // Almost There: schedule | email
  const [formReturn, setFormReturn] = useState("s15");
  const [quoteId, setQuoteId] = useState(null);
  const [msChoice, setMsChoice] = useState(null);
  const [msRooms, setMsRooms] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [bookingRef, setBookingRef] = useState(null);
  const [installDate, setInstallDate] = useState(null);
  const [showCG, setShowCG] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [resumeChecked, setResumeChecked] = useState(false);
  const [linkNotice, setLinkNotice] = useState(null);

  // Contractor name comes from Journey (white-label); Spanish keeps the Aire Azul brand.
  const brand = lang === "en" && catalog?.org?.name ? { ...BRAND.en, name: catalog.org.name } : BRAND[lang];
  const t = lang === "en" && catalog?.org?.name
    ? { ...T.en, whyP1: T.en.whyP1.replace(/^Air-Care Connect/, catalog.org.name) }
    : T[lang];
  const go = s => { setScreen(s); try { window.scrollTo(0, 0); } catch (e) {} };
  const ans = (k, v) => setAnswers(p => ({ ...p, [k]: v }));
  const cg = () => setShowCG(true);
  const common = { brand, t, lang, onCG: cg, onStartOver: () => handleStartOver(), onSave: () => setShowSaveModal(true) };

  // Load the live pricebook as soon as the app opens.
  useEffect(() => {
    Catalog.load().then(setCatalog).catch(() => setCatalogError(true));
  }, []);

  const isSaved = (eq) => !!eq && savedOptions.some(s => s.id === eq.id);
  const saveOption = (eq) => setSavedOptions(p => (p.some(s => s.id === eq.id) ? p : [...p, eq]));
  const removeOption = (eq) => setSavedOptions(p => p.filter(s => s.id !== eq.id));

  const handleStartOver = () => {
    try { localStorage.removeItem("acc_progress"); } catch (e) {}
    setScreen(mode === "duct" ? "d1" : "s1"); setProperty(null); setAnswers({}); setQuote(null); setDuct({});
    setBrandFamily(null); setSelectedBrands([]); setSelectedEq(null); setSavedOptions([]); setEmailEq(null);
    setQuoteId(null); setMsChoice(null); setMsRooms([]);
    setCustomerInfo(null); setPaymentInfo(null); setBookingRef(null); setInstallDate(null);
  };

  // Record a quote (for the office) and return its id. Never blocks the customer.
  const recordQuote = async (eq, info, status) => {
    if (!eq) return null;
    try {
      const total = quoteTotal(eq, quote);
      const row = await rpc("create_quote_v2", { p: {
        property_address: property?.address || null, property_sqft: property?.sqft || null,
        property_type: answers.homeKind || null, system_type: eq.system_type, home_type: answers.homeKind || null,
        cooling_adequate: answers.coolWell || null, flood_zone: answers.floodZone === "yes", system_age: answers.systemAge || null,
        hoa_required: answers.hoa === "yes", install_location: answers.installLocation || null, rooftop_note: Plan.isRooftop(answers.installLocation),
        journey_equipment_id: eq.id, ahri_ref: eq.ahri_ref || null, base_price: eq.installation_price, qualifiers_total: quote?.adderTotal || 0,
        final_price: total, deposit_amount: Math.round(total * 0.5), brand_family_selected: eq.brand_family || null,
        brand_selected: eq.brandName || eq.outdoor_brand, equipment_summary: eqSummary(eq),
        customer_name: info?.name || null, customer_email: info?.email || null, customer_phone: info?.phone || null,
        language: lang, quote_status: status || "pending",
        state: { v: 1, eq, property, answers, adderTotal: quote?.adderTotal || 0, tons: quote?.tons, lang, customerInfo: info || null },
      } });
      return row || null; // { id, quote_reference, resume_token }
    } catch (e) { console.warn("Quote record error:", e); return null; }
  };
  const quoteLinks = (row) => {
    if (!row?.quote_reference || !row?.resume_token) return null;
    const base = `${window.location.origin}/?q=${encodeURIComponent(row.quote_reference)}&t=${row.resume_token}`;
    return { approve: base + "&a=approve", view: base + "&a=view" };
  };

  const notifyOffice = (subject, rows) => {
    const html = `<div style="font-family:sans-serif;max-width:560px"><h2 style="color:#163E64">${esc(subject)}</h2>${
      rows.filter(r => r && r[1]).map(([k, v]) => `<p><strong>${esc(k)}:</strong> ${esc(v)}</p>`).join("")}</div>`;
    fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: OFFICE_EMAIL, subject, htmlContent: html }) }).catch(() => {});
  };

  const quoteEmailHtml = (eq, info, deposit, extra = {}) => {
    const total = quoteTotal(eq, quote);
    return buildQuoteEmailHtml({ ...extra,
      lang, brandName: brand.name, customerName: info?.name, address: property?.address,
      eq, total, monthly: Math.round(total / 60), deposit,
      lines: quoteLines(eq, catalog, lang), warranties: warrantyLines(eq, lang), rooftop: Plan.isRooftop(answers.installLocation),
      logoUrl: logoFor(catalog, eq),
    });
  };

  // "Email This Quote" → Almost There (email mode) → this.
  const emailQuoteNow = async (info) => {
    const eq = emailEq;
    const total = quoteTotal(eq, quote);
    const row = await recordQuote(eq, info, "emailed");
    const r = await fetch("/api/send-email", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: info.email.trim(),
        subject: lang === "es" ? `Su Cotización de ${brand.name}` : `Your ${brand.name} Quote`,
        htmlContent: quoteEmailHtml(eq, info, Math.round(total * 0.5), { links: quoteLinks(row) }),
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(lang === "es" ? "No pudimos enviar el correo. Intente de nuevo en un momento." : (data.error ? "We couldn't send the email right now. Please try again in a moment." : "Could not send — please try again."));
    setCustomerInfo(info);
    saveOption(eq);
    const id = row?.quote_reference || row?.id;
    notifyOffice(`Quote emailed — ${info.name}`, [
      ["Name", info.name], ["Email", info.email], ["Phone", info.phone], ["Contact by", info.contactPref],
      ["Address", property?.address], ["System", eqSummary(eq)], ["Price", money(total)], ["Quote #", id ? String(id) : ""],
    ]);
  };

  const finalizeBooking = async (pay) => {
    const total = quoteTotal(selectedEq, quote);
    const isFinancing = pay?.method === "ftl" || pay?.method === "microf";
    const deposit = isFinancing ? 0 : Math.round(total * 0.5);
    let ref = null;
    try {
      const row = await rpc("create_booking", { p: {
        quote_id: quoteId, customer_name: customerInfo?.name || null, customer_email: customerInfo?.email || null,
        customer_phone: customerInfo?.phone || null, contact_preference: customerInfo?.contactPref || null,
        install_date: installDate || null, install_address: property?.address || null, payment_method: pay?.method || null,
        payment_status: isFinancing ? "pending" : (pay?.status === "processing" ? "deposit_processing" : "deposit_paid"),
        deposit_amount: deposit, deposit_paid_at: !isFinancing && pay?.status === "succeeded" ? new Date().toISOString() : null,
        stripe_payment_intent: pay?.intentId || null,
        slot_held_until: new Date(Date.now() + (pay?.holdHours || 0) * 3600000).toISOString(),
        hoa_flag: answers.hoa === "yes", crane_flag: Plan.isRooftop(answers.installLocation),
        booking_status: "confirmed", financing_company: isFinancing ? pay.method : null,
        financing_status: isFinancing ? "pending" : "not_applicable", financing_applied_at: isFinancing ? new Date().toISOString() : null,
        equipment_summary: eqSummary(selectedEq), total_price: total,
      } });
      ref = row?.booking_reference || null;
    } catch (e) { console.error("Booking creation error:", e); }
    const finalRef = ref || `ACB-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`;
    setBookingRef(finalRef);

    notifyOffice(`New booking ${finalRef} — ${customerInfo?.name || ""}`, [
      ["Booking", finalRef + (ref ? "" : " (NOT SAVED — check the app database)")], ["Name", customerInfo?.name], ["Email", customerInfo?.email],
      ["Phone", customerInfo?.phone], ["Contact by", customerInfo?.contactPref], ["Address", property?.address],
      ["Install date", installDate], ["System", eqSummary(selectedEq)], ["Total", money(total)],
      ["Payment", `${pay?.method || ""}${pay?.status ? " (" + pay.status + ")" : ""}`], ["Deposit", isFinancing ? "None (financing)" : money(deposit)],
      ["Stripe payment", pay?.intentId || ""], ["Rooftop", Plan.isRooftop(answers.installLocation) ? "Yes — crane/rigging $800–$2,000 to be approved by customer" : ""],
      ["HOA", answers.hoa === "yes" ? "Yes" : ""],
    ]);

    if (customerInfo?.email) {
      fetch("/api/send-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: customerInfo.email,
          subject: lang === "es" ? `Confirmación de Reserva - ${finalRef}` : `Booking Confirmed - ${finalRef}`,
          htmlContent: buildConfirmationEmailHtml({
            lang, brandName: brand.name, customerName: customerInfo?.name, bookingRef: finalRef, installDate,
            address: property?.address, eq: selectedEq, total, paymentMethod: pay?.method, isFinancing,
          }),
        }),
      }).catch(e => console.error("Confirmation email error:", e));
      fetch("/api/send-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: customerInfo.email,
          subject: lang === "es" ? `Su Cotización Detallada - ${brand.name}` : `Your Detailed Estimate - ${brand.name}`,
          htmlContent: quoteEmailHtml(selectedEq, customerInfo, isFinancing ? null : deposit, { booked: true }),
        }),
      }).catch(e => console.error("Detailed estimate email error:", e));
    }
    if (customerInfo?.phone && (customerInfo?.contactPref === "text" || customerInfo?.contactPref === "both")) {
      const d = installDate ? new Date(installDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
      const body = lang === "es"
        ? `${brand.name}: Reserva confirmada! Ref: ${finalRef}. Instalacion: ${d}. Le llamaremos pronto para confirmar detalles.`
        : `${brand.name}: Booking confirmed! Ref: ${finalRef}. Install date: ${d}. We'll call soon to confirm details.`;
      fetch("/api/send-sms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: customerInfo.phone, message: body }) })
        .catch(e => console.error("Confirmation SMS error:", e));
    }
    go("confirmation");
  };

  // ── Duct cleaning: record, email and book ──
  const ductAnswersForOffice = () => ({
    ...duct,
    lastCleanedLabel: ductLabel(DUCT_LAST, duct.lastCleaned, "en"), ductTypeLabel: ductLabel(DUCT_TYPES, duct.ductType, "en"),
    ventsLabel: ductLabel(DUCT_VENTS, duct.vents, "en"), ahuLabel: ductLabel(DUCT_AHU, duct.ahu, "en"),
  });
  const recordDuctQuote = async (info, status) => {
    try {
      const q = ductQuoteFor(duct, catalog, "en");
      const row = await rpc("create_quote_v2", { p: {
        service_kind: "duct", guarantee_days: ductGuaranteeDays(catalog),
        property_address: property?.address || null, property_sqft: duct.sqft || property?.sqft || null,
        property_type: duct.homeKind || null, home_type: duct.homeKind || null, ahu_location: ductLabel(DUCT_AHU, duct.ahu, "en") || null,
        base_price: q.subtotal, final_price: q.total, deposit_amount: 0,
        equipment_summary: "Duct cleaning — " + q.lines.map(l => l.label).join("; "),
        customer_name: info?.name || null, customer_email: info?.email || null, customer_phone: info?.phone || null,
        language: lang, quote_status: status || "pending",
        state: { v: 1, kind: "duct", property, duct: ductAnswersForOffice(), lang, customerInfo: info || null },
      } });
      return row || null;
    } catch (e) { console.warn("Duct quote record error:", e); return null; }
  };
  const emailDuctQuote = async (info) => {
    const row = await recordDuctQuote(info, "emailed");
    if (row?.id) setQuoteId(row.id);
    const q = ductQuoteFor(duct, catalog, lang);
    const r = await fetch("/api/send-email", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: info.email.trim(),
        subject: lang === "es" ? `Su Cotización de Limpieza de Ductos — ${brand.name}` : `Your Duct Cleaning Quote — ${brand.name}`,
        htmlContent: buildDuctQuoteEmailHtml({ lang, brandName: brand.name, customerName: info.name, address: property?.address, q, days: ductGuaranteeDays(catalog), links: quoteLinks(row) }),
      }),
    });
    if (!r.ok) throw new Error(lang === "es" ? "No pudimos enviar el correo. Intente de nuevo en un momento." : "We couldn't send the email right now. Please try again in a moment.");
    setCustomerInfo(info);
    notifyOffice(`Duct cleaning quote emailed — ${info.name}`, [
      ["Name", info.name], ["Email", info.email], ["Phone", info.phone], ["Contact by", info.contactPref], ["Address", property?.address],
      ["Services", q.lines.map(l => l.label).join("; ")], ["Total", money2(q.total)], ["Quote #", row?.quote_reference || ""],
    ]);
  };
  const finalizeDuctBooking = async (pay) => {
    const q = ductQuoteFor(duct, catalog, "en");
    const paid = pay?.status === "succeeded";
    let ref = null;
    try {
      const row = await rpc("create_booking", { p: {
        service_kind: "duct", quote_id: quoteId, customer_name: customerInfo?.name || null, customer_email: customerInfo?.email || null,
        customer_phone: customerInfo?.phone || null, contact_preference: customerInfo?.contactPref || null,
        install_date: installDate || null, install_address: property?.address || null,
        payment_method: pay ? "card" : "on_site", payment_status: pay ? (paid ? "paid" : "processing") : "due_on_service",
        deposit_amount: pay ? q.total : 0, deposit_paid_at: paid ? new Date().toISOString() : null, stripe_payment_intent: pay?.intentId || null,
        booking_status: "confirmed", financing_status: "not_applicable",
        equipment_summary: "Duct cleaning — " + q.lines.map(l => l.label).join("; "), total_price: q.total,
        quote_lines: q.lines.filter(l => l.item).map(l => ({ item_id: l.item.id, qty: l.qty, label: l.label })),
      } });
      ref = row?.booking_reference || null;
    } catch (e) { console.error("Duct booking error:", e); }
    const finalRef = ref || `DCB-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`;
    setBookingRef(finalRef);
    const timeLabel = ductStartLabel(catalog, lang);
    notifyOffice(`New duct cleaning booking ${finalRef} — ${customerInfo?.name || ""}`, [
      ["Booking", finalRef + (ref ? "" : " (NOT SAVED — check the app database)")], ["Name", customerInfo?.name], ["Email", customerInfo?.email],
      ["Phone", customerInfo?.phone], ["Contact by", customerInfo?.contactPref], ["Address", property?.address],
      ["Service date", `${installDate} at ${ductStartLabel(catalog, "en")}`], ["Services", q.lines.map(l => l.label).join("; ")], ["Total", money2(q.total)],
      ["Payment", pay ? `Card ${money2(q.total)} (${pay.status || ""}) ${pay.intentId || ""}` : "Pay on the day of service"],
      ["Note", q.needsVisit ? "Sanitizing needs an in-person price (home over the largest tier)" : ""],
    ]);
    if (customerInfo?.email) {
      const qc = ductQuoteFor(duct, catalog, lang);
      fetch("/api/send-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: customerInfo.email,
          subject: lang === "es" ? `Servicio Confirmado - ${finalRef}` : `Service Confirmed - ${finalRef}`,
          htmlContent: buildDuctQuoteEmailHtml({ lang, brandName: brand.name, customerName: customerInfo?.name, address: property?.address, q: qc, days: ductGuaranteeDays(catalog), booked: true, date: installDate, timeLabel, paid }),
        }),
      }).catch(e => console.error("Duct confirmation email error:", e));
    }
    if (customerInfo?.phone && (customerInfo?.contactPref === "text" || customerInfo?.contactPref === "both")) {
      const d = installDate ? new Date(installDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
      const body = lang === "es"
        ? `${brand.name}: Limpieza de ductos confirmada! Ref: ${finalRef}. ${d} a las ${timeLabel}.`
        : `${brand.name}: Duct cleaning confirmed! Ref: ${finalRef}. ${d} at ${timeLabel}.`;
      fetch("/api/send-sms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: customerInfo.phone, message: body }) }).catch(() => {});
    }
    go("confirmation");
  };

  // Save/resume snapshot
  const buildStateSnapshot = () => ({
    lang, screen, property, answers, quote, brandFamily, selectedBrands, selectedEq, savedOptions, customerInfo, quoteId, mode, duct,
  });
  const restoreFromSnapshot = (snap) => {
    if (!snap) return;
    if (snap.lang) setLang(snap.lang);
    if ((snap.mode === "duct") !== (mode === "duct")) return; // a saved session from the other app path
    if (snap.mode === "duct") {
      if (snap.property) setProperty(snap.property);
      if (snap.duct) setDuct(snap.duct);
      if (snap.customerInfo) setCustomerInfo(snap.customerInfo);
      if (snap.quoteId) setQuoteId(snap.quoteId);
      const dk = ["s2", "s3", "dHome", "dVents", "dLast", "dType", "dRooms", "dAhu", "dServices", "dQuote", "dForm", "dSchedule"];
      setScreen(dk.includes(snap.screen) ? snap.screen : snap.property ? "dHome" : "d1");
      return;
    }
    if (snap.property) setProperty(snap.property);
    if (snap.answers) setAnswers(snap.answers);
    if (snap.quote && snap.quote.tons) setQuote(snap.quote);
    if (snap.brandFamily && FAMILY_KEYS.includes(snap.brandFamily)) setBrandFamily(snap.brandFamily);
    if (Array.isArray(snap.selectedBrands)) setSelectedBrands(snap.selectedBrands);
    if (snap.selectedEq && typeof snap.selectedEq.id === "string") setSelectedEq(snap.selectedEq);
    if (Array.isArray(snap.savedOptions)) setSavedOptions(snap.savedOptions.filter(e => typeof e.id === "string"));
    if (snap.customerInfo) setCustomerInfo(snap.customerInfo);
    if (snap.quoteId) setQuoteId(snap.quoteId);
    // Sessions saved by the previous version of the app restart at the system-type question.
    const known = ["s2", "s3", "s4", "sHome", "s5", "s6", "s7", "s8", "s9", "s8b", "s11", "s12", "s13", "s14", "s15", "savedQuotes", "s16", "schedule", "checkout"];
    if (snap.screen && known.includes(snap.screen) && (snap.quote?.tons || ["s2", "s3", "s4", "sHome", "s5", "s6", "s7", "s8", "s9", "s8b"].includes(snap.screen))) setScreen(snap.screen);
    else if (snap.property) setScreen("s4");
  };

  useEffect(() => {
    if (!resumeChecked || screen === "s1" || screen === "d1") return;
    try {
      if (screen === "confirmation") localStorage.removeItem("acc_progress");
      else localStorage.setItem("acc_progress", JSON.stringify(buildStateSnapshot()));
    } catch (e) {}
  }, [screen, property, answers, quote, brandFamily, selectedBrands, selectedEq, savedOptions, customerInfo, quoteId, resumeChecked, duct]);

  useEffect(() => {
    const checkResume = async () => {
      const params = new URLSearchParams(window.location.search);
      // Emailed quote link: ?q=<quote ref>&t=<private token>&a=approve|view
      const qRef = params.get("q"), qTok = params.get("t");
      if (qRef && qTok) {
        try {
          const res = await rpc("get_quote_resume", { p_ref: qRef, p_token: qTok });
          const st = res?.state;
          window.history.replaceState({}, "", window.location.pathname);
          if (st?.kind === "duct" && st?.duct) {
            if (st.lang) setLang(st.lang);
            setMode("duct");
            setProperty(st.property || null);
            setDuct(st.duct);
            if (st.customerInfo) setCustomerInfo(st.customerInfo);
            setQuoteId(res.quote_id || null);
            setFormMode("schedule");
            const ci = st.customerInfo;
            const hasContact = ci && ci.name && ci.email && ci.phone;
            if (res.expired) setLinkNotice("expired");
            setScreen(!res.expired && params.get("a") === "approve" ? (hasContact ? "dSchedule" : "dForm") : "dQuote");
            setResumeChecked(true);
            return;
          }
          if (st?.eq && st?.property) {
            if (st.lang) setLang(st.lang);
            setProperty(st.property);
            setAnswers(st.answers || {});
            setQuote({ answers: st.answers || {}, adderTotal: Number(st.adderTotal) || 0, tons: st.tons });
            if (st.customerInfo) setCustomerInfo(st.customerInfo);
            setQuoteId(res.quote_id || null);
            setSelectedBrands([]);
            if (res.expired) {
              setLinkNotice("expired");
              setScreen("s11");
            } else {
              setSelectedEq(st.eq);
              setSavedOptions([st.eq]);
              setEmailEq(st.eq);
              setFormMode("schedule"); setFormReturn("s15");
              const ci = st.customerInfo;
              const hasContact = ci && ci.name && ci.email && ci.phone;
              setScreen(params.get("a") === "approve" ? (hasContact ? "schedule" : "s16") : "s15");
            }
            setResumeChecked(true);
            return;
          }
        } catch (e) { console.warn("Quote link error:", e); }
      }
      const resumeToken = params.get("resume");
      if (resumeToken) {
        try {
          const r = await fetch(`/api/resume-progress?token=${resumeToken}`);
          const data = await r.json();
          if (data.stateSnapshot && !data.expired) {
            restoreFromSnapshot(data.stateSnapshot);
            window.history.replaceState({}, "", window.location.pathname);
            setResumeChecked(true);
            return;
          }
        } catch (e) { console.warn("Resume link error:", e); }
      }
      try {
        const saved = localStorage.getItem("acc_progress");
        if (saved) restoreFromSnapshot(JSON.parse(saved));
      } catch (e) {}
      setResumeChecked(true);
    };
    checkResume();
  }, []);

  const saveProgressNow = async (email, name) => {
    const r = await fetch("/api/save-progress", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, stateSnapshot: buildStateSnapshot(), lang }),
    });
    const data = await r.json();
    if (!data.success) throw new Error(data.error || "Save failed");
    if (!customerInfo?.email) setCustomerInfo(p => ({ ...(p || {}), email, name: name || p?.name }));
  };

  // Build the quote context (size + adders) once the questions are answered.
  const buildQuote = useCallback(async (prop, curAnswers) => {
    setQuoteFailed(false);
    try {
      const [{ total: adderTotal, applied }, cat] = await Promise.all([QuoteEngine.calcAdders(curAnswers), Catalog.load()]);
      setCatalog(cat);
      setQuote({ answers: curAnswers, adderTotal, applied, tons: Plan.tons(prop, curAnswers) });
    } catch (err) {
      console.error("buildQuote failed:", err);
      setQuote(null);
      setQuoteFailed(true);
    }
  }, []);

  const ready = quote && catalog;
  const detectedKind = (() => {
    const d = answers.detectedHomeType;
    return d === "manufactured" ? "mobile" : d === "apartment" ? "apt" : d === "site-built" ? "sitebuilt" : null;
  })();

  return (
    <div style={{ minHeight: "100vh", background: "#b0d8ec" }}>
      <FontLoader />
      <LangToggle lang={lang} setLang={setLang} />
      {showCG && <ComfortGuide lang={lang} brand={brand} t={t} onClose={() => setShowCG(false)}
        onDuctEmail={emailDuctQuote}
        customerContext={mode === "duct"
          ? { mode, screen, property, duct, ductQuote: catalog ? ductQuoteFor(duct, catalog, "en") : null,
              guaranteeDays: ductGuaranteeDays(catalog), startLabel: ductStartLabel(catalog, lang), warrantyText: ductSettings(catalog?.ductSettings).warranty_text }
          : { screen, property, answers, tons: quote?.tons, adderTotal: quote?.adderTotal, brandFamily: brandFamily ? Plan.familyLabel(brandFamily, "en") : null, selectedEq }} />}

      {showSaveModal && (
        <SaveProgressModal t={t} lang={lang} customerInfo={customerInfo} onClose={() => setShowSaveModal(false)} onSaved={saveProgressNow} />
      )}

      {screen === "s1" && <S1_Landing {...common} onStart={() => go("s2")} />}

      {screen === "s2" && <S2_Address {...common} onFound={p => { setProperty(p); go("s3"); }} onBack={() => go(mode === "duct" ? "d1" : "s1")} />}

      {screen === "s3" && <S3_ConfirmHome {...common} property={property}
        onConfirm={(verified) => {
          if (verified) {
            setProperty(verified);
            const type = (verified.type || "").toLowerCase();
            const isManufactured = type.includes("manufactured") || type.includes("mobile");
            const isApt = type.includes("condo") || type.includes("apartment") || type.includes("multi");
            setAnswers(p => ({ ...p, detectedHomeType: isManufactured ? "manufactured" : isApt ? "apartment" : "site-built", detectedSqft: verified.sqft || p.detectedSqft }));
            if (mode === "duct") setDuct(d => ({ ...d, sqft: d.sqft || verified.sqft || null }));
          }
          go(mode === "duct" ? "dHome" : "s4");
        }}
        onEdit={() => go("s2")} onBack={() => go("s2")} />}

      {screen === "s4" && <S4_Intent {...common}
        onSelect={id => {
          if (id === "guide") { setShowCG(true); return; }
          if (id === "minisplit") { go("ms1"); return; }
          setMsChoice(null);
          go("sHome");
        }}
        onBack={() => go("s3")} />}

      {screen === "sHome" && <S_HomeType {...common} detected={answers.homeKind || detectedKind}
        onSelect={v => { ans("homeKind", v); go("s5"); }} onBack={() => go("s4")} />}

      {screen === "s5" && <S5_CoolWell {...common} onSelect={v => { ans("coolWell", v); go("s6"); }} onBack={() => go("sHome")} />}
      {screen === "s6" && <S6_FloodZone {...common} onSelect={v => { ans("floodZone", v); go("s7"); }} onBack={() => go("s5")} />}
      {screen === "s7" && <S7_SystemAge {...common} onSelect={v => { ans("systemAge", v); go("s8"); }} onBack={() => go("s6")} />}
      {screen === "s8" && <S8_HOA {...common} onSelect={v => { ans("hoa", v); go("s9"); }} onBack={() => go("s7")} />}
      {screen === "s9" && <S9_SystemType {...common} onSelect={v => { ans("systemType", v); go("s8b"); }} onBack={() => go("s8")} />}

      {screen === "s8b" && <S_InstallLocation {...common} systemType={answers.systemType}
        onSelect={v => {
          const upstairs = /^ah_(attic|ceiling)/.test(v);
          const newAnswers = { ...answers, installLocation: v, buildingFloor: answers.homeKind === "multistory" && upstairs ? "second" : null };
          setAnswers(newAnswers);
          setQuote(null);
          setBrandFamily(null); setSelectedBrands([]);
          go("s10");
          buildQuote(property, newAnswers);
        }}
        onBack={() => go("s9")} />}

      {screen === "s10" && <S10_Preparing brand={brand} t={t} onDone={() => go("s11")} quoteReady={!!ready} />}

      {screen === "s11" && ready && linkNotice === "expired" && (
        <div style={{ maxWidth: 430, margin: "0 auto", padding: "10px 20px 0" }}>
          <div style={{ background: "#fefce8", border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#854d0e", fontWeight: 700 }}>
            {L(lang, "The 45-day guarantee on your earlier quote has ended, so here are today's prices for your home. Choose again and your new quote is guaranteed for another 45 days.",
              "La garantía de 45 días de su cotización anterior terminó; estos son los precios de hoy para su casa. Elija de nuevo y su nueva cotización queda garantizada por otros 45 días.")}
          </div>
        </div>
      )}
      {screen === "s11" && ready && <S_Recommendation {...common} quote={quote} catalog={catalog} onChooseFamily={() => { setLinkNotice(null); go("s12"); }} onBack={() => go("s8b")} />}
      {["s11", "s12", "s13", "s14", "s15", "savedQuotes"].includes(screen) && !ready && (
        <Shell t={t} brand={brand} onCG={cg} onStartOver={handleStartOver} showBack onBack={() => go("s9")}>
          {catalogError || quoteFailed || !property || !answers.installLocation ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
              <h2 style={{ fontWeight: 900, color: C.navy, marginBottom: 8 }}>{L(lang, "We hit a snag", "Tuvimos un problema")}</h2>
              <p style={{ color: "#64748b", marginBottom: 24 }}>{L(lang, "We could not load your estimate. This is usually temporary — please try again.", "No pudimos cargar su estimado. Suele ser temporal — intente de nuevo.")}</p>
              <BlueBtn onClick={() => { setCatalogError(false); Catalog.load().then(setCatalog).catch(() => setCatalogError(true)); if (property && answers.installLocation) buildQuote(property, answers); }} style={{ maxWidth: 240 }}>
                ← {L(lang, "Try Again", "Intentar de Nuevo")}
              </BlueBtn>
            </div>
          ) : <CenteredSpinner text={L(lang, "Loading…", "Cargando…")} />}
        </Shell>
      )}

      {screen === "s12" && ready && <S_BrandFamily {...common} quote={quote} catalog={catalog}
        onSelect={f => { if (f !== brandFamily) setSelectedBrands([]); setBrandFamily(f); go("s13"); }} onBack={() => go("s11")} />}

      {screen === "s13" && ready && <S_ChooseBrands {...common} quote={quote} catalog={catalog} fam={brandFamily} selected={selectedBrands}
        onToggle={k => setSelectedBrands(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k])}
        onContinue={keys => { setSelectedBrands(keys); go("s14"); }} onBack={() => go("s12")} />}

      {screen === "s14" && ready && <S_SelectedRecs {...common} quote={quote} catalog={catalog} fam={brandFamily} brandKeys={selectedBrands}
        savedCount={savedOptions.length} onSavedQuotes={() => go("savedQuotes")}
        onPick={eq => { setSelectedEq(eq); go("s15"); }} onChangeSystem={() => go("s12")} onBack={() => go("s13")} />}

      {screen === "s15" && ready && selectedEq && <S_QuoteDetail {...common} quote={quote} catalog={catalog} eq={selectedEq}
        saved={isSaved(selectedEq)} savedCount={savedOptions.length}
        onChoose={() => { setFormMode("schedule"); setFormReturn("s15"); go("s16"); }}
        onEmail={() => { setEmailEq(selectedEq); setFormMode("email"); setFormReturn("s15"); go("s16"); }}
        onSaveAndMore={() => { saveOption(selectedEq); go(selectedBrands.length ? "s14" : "s12"); }}
        onSavedQuotes={() => go("savedQuotes")}
        onBack={() => go(selectedBrands.length ? "s14" : "savedQuotes")} />}

      {screen === "savedQuotes" && ready && <S_SavedQuotes {...common} quote={quote} catalog={catalog} saved={savedOptions}
        onOpen={eq => { setSelectedEq(eq); go("s15"); }}
        onEmail={eq => { setEmailEq(eq); setFormMode("email"); setFormReturn("savedQuotes"); go("s16"); }}
        onRemove={removeOption} onMore={() => go("s12")} onBack={() => go(selectedEq ? "s15" : "s14")} />}

      {screen === "s16" && <S_AlmostThere {...common} mode={formMode} initial={customerInfo} emailEq={emailEq}
        onEmailSend={emailQuoteNow}
        onAfterEmail={() => go(savedOptions.length ? "savedQuotes" : formReturn)}
        onContinue={async info => {
          setCustomerInfo(info);
          const eq = formMode === "email" ? emailEq : selectedEq;
          if (eq) setSelectedEq(eq);
          const row = await recordQuote(eq, info, "approved");
          if (row?.id) setQuoteId(row.id);
          go("schedule");
        }}
        onViewTerms={() => go("terms")} onViewPrivacy={() => go("privacy")}
        onBack={() => go(formReturn)} />}

      {screen === "terms" && <LegalDocScreen brand={brand} t={t} title="Terms of Service" sections={TERMS_OF_SERVICE_SECTIONS} onBack={() => go(mode === "duct" ? "dForm" : msChoice ? "msRequest" : "s16")} onCG={cg} />}
      {screen === "privacy" && <LegalDocScreen brand={brand} t={t} title="Privacy Policy" sections={PRIVACY_POLICY_SECTIONS} onBack={() => go(mode === "duct" ? "dForm" : msChoice ? "msRequest" : "s16")} onCG={cg} />}

      {screen === "schedule" && (
        <CheckoutCalendar {...common} paymentInfo={paymentInfo}
          onConfirm={async (date) => {
            setInstallDate(date.available_date);
            go("checkout");
          }}
          onBack={() => go("s16")} />
      )}

      {screen === "checkout" && selectedEq && quote && (
        <CheckoutPayment {...common} quote={quote} selectedEq={selectedEq} customerInfo={customerInfo}
          onSelectMethod={method => go(`pay_${method}`)} onBack={() => go("schedule")} />
      )}

      {(screen === "pay_card" || screen === "pay_ach") && selectedEq && quote && (
        <CheckoutStripe key={screen} {...common} method={screen === "pay_ach" ? "ach" : "card"}
          deposit={Math.round(quoteTotal(selectedEq, quote) * 0.5)} customerInfo={customerInfo}
          onSuccess={info => { setPaymentInfo(info); finalizeBooking(info); }} onBack={() => go("checkout")} />
      )}

      {screen === "pay_ftl" && selectedEq && quote && (
        <CheckoutFTL {...common} total={quoteTotal(selectedEq, quote)} customerInfo={customerInfo}
          onSuccess={info => { setPaymentInfo(info); finalizeBooking(info); }} onBack={() => go("checkout")} />
      )}

      {screen === "pay_microf" && selectedEq && quote && (
        <CheckoutMicrof {...common} total={quoteTotal(selectedEq, quote)} customerInfo={customerInfo}
          onSuccess={info => { setPaymentInfo(info); finalizeBooking(info); }} onBack={() => go("checkout")} />
      )}

      {screen === "confirmation" && mode !== "duct" && (
        <CheckoutConfirmation brand={brand} t={t} bookingRef={bookingRef} installDate={installDate} customerInfo={customerInfo}
          onDone={handleStartOver} />
      )}
      {screen === "confirmation" && mode === "duct" && (
        <CheckoutConfirmation brand={brand} t={t} bookingRef={bookingRef} installDate={installDate} customerInfo={customerInfo}
          titleText={L(lang, "You're All Set!", "¡Todo Listo!")}
          descText={L(lang, "Your duct cleaning is scheduled. We've sent a confirmation to your email.", "Su limpieza de ductos está programada. Le enviamos una confirmación a su correo.")}
          dateLabel={L(lang, "Service Date", "Fecha de Servicio")} timeText={ductStartLabel(catalog, lang)}
          steps={[
            L(lang, "You'll receive an email confirmation within minutes", "Recibirá una confirmación por correo en minutos"),
            L(lang, "Our office may call to confirm the details", "Nuestra oficina puede llamarle para confirmar los detalles"),
            L(lang, "Our technicians arrive on your scheduled day — pay then by check, card or cash if you haven't already", "Nuestros técnicos llegan el día programado — pague entonces con cheque, tarjeta o efectivo si aún no lo hizo"),
          ]}
          onDone={handleStartOver} />
      )}

      {/* ── Duct cleaning path ── */}
      {screen === "d1" && <S_DuctLanding {...common} onStart={() => go("s2")} />}
      {mode === "duct" && !catalog && ["dHome", "dVents", "dLast", "dType", "dRooms", "dAhu", "dServices", "dQuote", "dForm", "dSchedule", "dPay", "dCard"].includes(screen) && (
        <Shell t={t} brand={brand} onCG={cg} onStartOver={handleStartOver} showBack onBack={() => go("s3")}>
          {catalogError ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
              <h2 style={{ fontWeight: 900, color: C.navy, marginBottom: 8 }}>{L(lang, "We hit a snag", "Tuvimos un problema")}</h2>
              <BlueBtn onClick={() => { setCatalogError(false); Catalog.load().then(setCatalog).catch(() => setCatalogError(true)); }} style={{ maxWidth: 240 }}>← {L(lang, "Try Again", "Intentar de Nuevo")}</BlueBtn>
            </div>
          ) : <CenteredSpinner text={L(lang, "Loading…", "Cargando…")} />}
        </Shell>
      )}
      {catalog && <>
        {screen === "dHome" && <S_HomeType {...common} detected={duct.homeKind || detectedKind}
          sub={L(lang, "This helps us price your dryer vent and plan the visit.", "Esto nos ayuda a cotizar el ducto de secadora y planear la visita.")}
          onSelect={v => { setDuct(d => ({ ...d, homeKind: v })); go("dVents"); }} onBack={() => go("s3")} />}
        {screen === "dVents" && <S_DuctChoice {...common} title={L(lang, "Where Are Your Vents Located?", "¿Dónde Están Sus Rejillas?")}
          sub={L(lang, "Where are they mostly located?", "¿Dónde se encuentran principalmente?")} opts={DUCT_VENTS} selected={duct.vents}
          onSelect={v => { setDuct(d => ({ ...d, vents: v })); go("dLast"); }} onBack={() => go("dHome")} />}
        {screen === "dLast" && <S_DuctChoice {...common} title={L(lang, "When Were Your Ducts Last Cleaned?", "¿Cuándo Se Limpiaron Sus Ductos por Última Vez?")}
          sub={L(lang, "This lets us know to what depth of cleaning you may need.", "Esto nos indica qué tan profunda debe ser la limpieza.")} opts={DUCT_LAST} selected={duct.lastCleaned}
          onSelect={v => { setDuct(d => ({ ...d, lastCleaned: v })); go("dType"); }} onBack={() => go("dVents")} />}
        {screen === "dType" && <S_DuctChoice {...common} title={L(lang, "What Type Ducts Do You Have?", "¿Qué Tipo de Ductos Tiene?")}
          sub={L(lang, "This helps us to decide what type of equipment to use to clean them.", "Esto nos ayuda a decidir qué equipo usar para limpiarlos.")} opts={DUCT_TYPES} selected={duct.ductType}
          onSelect={v => { setDuct(d => ({ ...d, ductType: v })); go("dRooms"); }} onBack={() => go("dLast")} />}
        {screen === "dRooms" && <S_DuctRooms {...common} rooms={duct.rooms} sqft={duct.sqft || property?.sqft} catalog={catalog}
          onContinue={(rooms, sqft) => { setDuct(d => ({ ...d, rooms, sqft })); go("dAhu"); }} onBack={() => go("dType")} />}
        {screen === "dAhu" && <S_DuctChoice {...common} title={L(lang, "Where is Your Air Handler Located?", "¿Dónde Está Su Manejador de Aire?")}
          sub={L(lang, "This helps determine what services we can offer based upon accessibility.", "Esto determina qué servicios podemos ofrecer según el acceso.")} opts={DUCT_AHU} selected={duct.ahu}
          onSelect={v => { setDuct(d => ({ ...d, ahu: v })); go("dServices"); }} onBack={() => go("dRooms")} />}
        {screen === "dServices" && <S_DuctServices {...common} ahu={duct.ahu} selected={duct.services}
          onContinue={services => { setDuct(d => ({ ...d, services })); go("dQuote"); }} onBack={() => go("dAhu")} />}
        {screen === "dQuote" && linkNotice === "expired" && (
          <div style={{ maxWidth: 430, margin: "0 auto", padding: "10px 20px 0" }}>
            <div style={{ background: "#fefce8", border: `1.5px solid ${C.gold}`, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#854d0e", fontWeight: 700 }}>
              {L(lang, "The guarantee on your earlier quote has ended, so this is today's price for the same services.", "La garantía de su cotización anterior terminó; este es el precio de hoy para los mismos servicios.")}
            </div>
          </div>
        )}
        {screen === "dQuote" && <S_DuctQuote {...common} duct={duct} catalog={catalog}
          onApprove={() => { setLinkNotice(null); setFormMode("schedule"); go("dForm"); }}
          onEdit={() => go("dServices")}
          onEmail={() => { setFormMode("email"); go("dForm"); }}
          onBack={() => go("dServices")} />}
        {screen === "dForm" && <S_AlmostThere {...common} mode={formMode} initial={customerInfo}
          summaryText={L(lang, "Duct Cleaning & Dryer Vent Cleaning", "Limpieza de Ductos y Ducto de Secadora") + " — " + money2(ductQuoteFor(duct, catalog, lang).total)}
          continueText={L(lang, "Continue to Pick My Day", "Continuar para Elegir Mi Día")}
          onEmailSend={emailDuctQuote}
          onAfterEmail={() => go("dQuote")}
          onContinue={async info => {
            setCustomerInfo(info);
            const row = await recordDuctQuote(info, "approved");
            if (row?.id) setQuoteId(row.id);
            go("dSchedule");
          }}
          onViewTerms={() => go("terms")} onViewPrivacy={() => go("privacy")}
          onBack={() => go("dQuote")} />}
        {screen === "dSchedule" && <CheckoutCalendar {...common} daysUrl={DUCT_DAYS_URL}
          titleText={L(lang, "Choose Your Service Day", "Elija Su Día de Servicio")}
          descText={L(lang, `We arrive at ${ductStartLabel(catalog, "en")} on the day you choose.`, `Llegamos a las ${ductStartLabel(catalog, "es")} el día que elija.`)}
          noteText={L(lang, "Need to change it later? Just call us.", "¿Necesita cambiarlo después? Solo llámenos.")}
          onConfirm={date => { setInstallDate(date.available_date); go("dPay"); }}
          onBack={() => go("dForm")} />}
        {screen === "dPay" && installDate && <S_DuctPay {...common} total={ductQuoteFor(duct, catalog, lang).total} date={installDate} timeLabel={ductStartLabel(catalog, lang)}
          onPayLater={() => finalizeDuctBooking(null)} onPayNow={() => go("dCard")} onBack={() => go("dSchedule")} />}
        {screen === "dCard" && <CheckoutStripe {...common} method="card" deposit={ductQuoteFor(duct, catalog, "en").total} customerInfo={customerInfo}
          descriptionText={`${brand.name} - Duct Cleaning ${installDate || ""}`} titleText={L(lang, "Pay by Card", "Pagar con Tarjeta")}
          onSuccess={info => { setPaymentInfo(info); finalizeDuctBooking(info); }} onBack={() => go("dPay")} />}
      </>}

      {/* ── Mini-split path ── */}
      {screen === "ms1" && <S_MiniSplitStart {...common}
        onSelect={id => { setMsChoice(id); setMsRooms([]); go(id === "4+" ? "msRequest" : ["1", "2", "3"].includes(id) ? "ms2" : "msRequest"); }}
        onBack={() => go("s4")} />}
      {screen === "ms2" && <S_MiniSplitRooms {...common} count={msChoice} onContinue={r => { setMsRooms(r); go("msRequest"); }} onBack={() => go("ms1")} />}
      {screen === "msRequest" && <S_MiniSplitRequest {...common} choice={msChoice} rooms={msRooms} property={property}
        onDone={handleStartOver} onBack={() => go(["1", "2", "3"].includes(msChoice) ? "ms2" : "ms1")}
        onViewTerms={() => go("terms")} onViewPrivacy={() => go("privacy")} />}
    </div>
  );
}
