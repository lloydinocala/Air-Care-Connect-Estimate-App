import { useState, useRef, useEffect, useCallback } from "react";

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
const STRIPE_PUBLISHABLE_KEY = "pk_test_51TlgwhIH4oQGJWTRM76aWpR6oHRIRsy4ajl9Q4qTHtSgZCopVuyyAGZZNBaP0oAeUBKbWQlcoCs9yptLqyeqaXr300yXr7vCZi";
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
    trending: "Trending in 2026", trendingSub: "CrossOver side-discharge systems — the most efficient and innovative option available.",
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
    trending: "Tendencia en 2026", trendingSub: "Sistemas CrossOver de descarga lateral — la opción más eficiente disponible.",
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
  // Calculate tonnage from square footage
  // Site-built: 650 sqft/ton, Manufactured: 500 sqft/ton
  // Round UP to nearest 0.5 ton
  calcTonnage: (sqft, coolWell, homeType) => {
    const isManufactured = homeType && 
      (homeType.toLowerCase().includes("manufactured") || 
       homeType.toLowerCase().includes("mobile"));
    const divisor = isManufactured ? 500 : 650;
    const raw = sqft / divisor;
    // CEILING to nearest 0.5 ton
    const rounded = Math.ceil(raw * 2) / 2;
    // If system always struggled, upsize by 0.5 ton
    if (coolWell === "struggled") {
      return Math.ceil((rounded + 0.5) * 2) / 2;
    }
    return rounded;
  },

  // Round up to whole ton for CrossOver systems
  crossoverTonnage: (tons) => Math.ceil(tons),

  // Map system type answer to DB system_type values
  getSystemTypes: (sysAnswer, brandFamily, homeType) => {
    const isApt = homeType && 
      (homeType.toLowerCase().includes("condo") || 
       homeType.toLowerCase().includes("apartment") ||
       homeType.toLowerCase().includes("multi"));

    if (sysAnswer === "electric") {
      if (brandFamily === "Trending in 2026") return ["CrossOver"];
      if (isApt) return ["Apt Split"];
      return ["Split"];
    }
    if (sysAnswer === "package") return ["Packaged"];
    if (sysAnswer === "gas") return ["Gas"];
    return ["Split"];
  },

  // Calculate all price adders based on answers
  calcAdders: (answers) => {
    let total = 0;
    const applied = [];

    if (answers.floodZone === "yes") { total += 500; applied.push("flood_zone"); }
    if (answers.systemAge === "new") { total += 150; applied.push("system_age_new"); }
    if (answers.systemAge === "old") { total += 750; applied.push("system_age_old"); }
    if (answers.hoa === "yes") { total += 200; applied.push("hoa_approval"); }
    if (answers.ahuStandCondition === "poor") { total += 300; applied.push("ahu_stand_rebuild"); }
    if (answers.buildingFloor === "second") { total += 750; applied.push("second_floor_lineset"); }
    if (answers.rooftopCrane) { total += 500; applied.push("rooftop_crane"); }
    if (answers.ductReplacement === "yes") {
      if (answers.homeWidth === "single") { total += 1500; applied.push("duct_replacement_single"); }
      if (answers.homeWidth === "double") { total += 2400; applied.push("duct_replacement_double"); }
      if (answers.homeWidth === "triple") { total += 3200; applied.push("duct_replacement_triple"); }
    }
    return { total, applied };
  },

  // Fetch equipment from Supabase
  fetchEquipment: async (systemType, tons, brandFamily, recommended = false, homeType = null) => {
    // Handle CrossOver rounding
    const queryTons = ["CrossOver", "Apt CrossOver"].includes(systemType)
      ? QuoteEngine.crossoverTonnage(tons)
      : tons;

    let params = `system_type=eq.${encodeURIComponent(systemType)}&size_tons=eq.${queryTons}&active=eq.true&order=seer2.asc`;
    if (brandFamily) params += `&brand_family=eq.${encodeURIComponent(brandFamily)}`;
    if (recommended) params += `&recommended=eq.true`;

    // Filter by home type if provided
    if (homeType) {
      const isManufactured = homeType.toLowerCase().includes("manufactured") || 
                             homeType.toLowerCase().includes("mobile");
      if (isManufactured) {
        params += `&home_type=in.(Manufactured Home,Both)`;
      } else {
        params += `&home_type=in.(Site-Built,Both)`;
      }
    }

    return sb.get("equipment", params);
  },

  // Get unique brands for a system type + brand family
  fetchBrands: async (systemType, tons, brandFamily) => {
    const equipment = await QuoteEngine.fetchEquipment(systemType, tons, brandFamily);
    const brands = [...new Set(equipment.map(e => e.outdoor_brand))].filter(Boolean);
    return brands;
  },

  // All standard tonnage sizes in order, for stepping up when exact size unavailable
  TONNAGE_LADDER: [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],

  // All brand families in price order, for stepping between tiers
  BRAND_FAMILY_ORDER: ["Budget-Friendly", "Commonly Purchased", "Trending in 2026", "Premium Products"],

  // Find the best available system for a brand, stepping UP in size if exact tonnage is unavailable.
  // Never steps down — undersizing an AC system is never acceptable.
  // Returns { equipment: [...], actualTons, sizeAdjusted: bool }
  fetchEquipmentWithSizeFallback: async (systemType, requestedTons, brandFamily, homeType, selectedBrand) => {
    const ladder = QuoteEngine.TONNAGE_LADDER.filter(t => t >= requestedTons);
    for (const tons of ladder) {
      let results = await QuoteEngine.fetchEquipment(systemType, tons, brandFamily, false, homeType);
      if (selectedBrand && selectedBrand !== "recommended") {
        results = results.filter(e => e.outdoor_brand === selectedBrand);
      }
      if (results.length > 0) {
        return { equipment: results, actualTons: tons, sizeAdjusted: tons !== requestedTons };
      }
    }
    return { equipment: [], actualTons: requestedTons, sizeAdjusted: false };
  },

  // Get price range for a system type + tonnage
  getPriceRange: (equipment, adderTotal) => {
    if (!equipment.length) return { min: 0, max: 0 };
    const prices = equipment.map(e => (e.installation_price || 0) + adderTotal);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
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

function Shell({ children, t, brand, onCG, showBack, onBack, showSave, onSave }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: FONT, maxWidth: 430, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "14px 20px 0" }}>
        {showBack
          ? <button onClick={onBack} style={{ background: C.white, border: `2px solid ${C.blue}`, borderRadius: "50%", width: 36, height: 36, color: C.blue, fontWeight: 900, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SHADOW_SM, flexShrink: 0 }}>←</button>
          : <div style={{ width: 36 }} />}
        <div style={{ flex: 1, textAlign: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: C.blue, letterSpacing: 2, textTransform: "uppercase" }}>{brand.name}</span>
        </div>
        {showSave
          ? <button onClick={onSave} style={{ background: "none", border: "none", color: C.blue, fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: FONT }}>💾 Save</button>
          : <div style={{ width: 36 }} />}
      </div>
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
          {t.scheduleThis}
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

// ── COMFORT GUIDE ──────────────────────────────────────────────────────────────
function ComfortGuide({ lang, brand, t, onClose, customerContext }) {
  const [msgs, setMsgs] = useState([{ role: "assistant", content: t.cgWelcome }]);
  const [input, setInput] = useState(""); const [busy, setBusy] = useState(false);
  const [sendStatus, setSendStatus] = useState(null); // null | "sending" | "sent" | "error"
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

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
        const priceLine = total ? `$${total.toLocaleString()} installed` : "your custom estimate";
        const sysLine = eq ? `${eq.outdoor_brand} ${eq.outdoor_series} (${eq.size_tons} Ton, SEER2 ${eq.seer2})` : "your AC system";
        try {
          const emailResp = await fetch("/api/send-email", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: email,
              subject: lang === "es" ? `Su Cotización de ${brand.name}` : `Your ${brand.name} Quote`,
              htmlContent: `
                <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                  <h2 style="color: #163E64;">${lang === "es" ? "Su Cotización" : "Your Quote"}</h2>
                  <p>${lang === "es" ? "Hola" : "Hi"} ${name || ""},</p>
                  <p>${lang === "es" ? "Aquí está el resumen de su cotización para" : "Here's a summary of your quote for"} ${address}:</p>
                  <div style="background:#f0f9ff; border:2px solid #00B0F0; border-radius:12px; padding:16px; margin:16px 0;">
                    <strong>${sysLine}</strong><br/>
                    <span style="font-size:24px; font-weight:900; color:#163E64;">${priceLine}</span>
                  </div>
                  <p>${lang === "es" ? "Esta cotización está garantizada por 45 días." : "This quote is guaranteed for 45 days."}</p>
                </div>
              `,
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

    const contextSnapshot = buildCustomerContext(customerContext);

    try {
      const sys = lang === "en"
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
- Brand families: Budget-Friendly (practical, reliable), Commonly Purchased (best balance of price/features), Trending in 2026 (CrossOver side-discharge systems — currently our most efficient and innovative option), Premium Products (top-tier efficiency and features)
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
          tools: [{
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
          }],
        }),
      });
      const d = await r.json();

      if (d.toolUse?.name === "send_estimate") {
        const { name, email, phone } = d.toolUse.input;
        setMsgs(p => [...p, { role: "assistant", content: d.text || (lang === "es" ? "¡Perfecto! Enviando su cotización ahora..." : "Perfect! Sending your estimate now...") }]);
        await sendEstimateToCustomer(name, email, phone);
        setMsgs(p => [...p, { role: "assistant", content: lang === "es"
          ? `✅ ¡Listo! Hemos enviado su cotización a ${email}${phone ? " y por mensaje de texto a " + phone : ""}.`
          : `✅ Done! We've sent your estimate to ${email}${phone ? " and via text to " + phone : ""}.` }]);
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
function S1_Landing({ brand, t, onStart, onCG, onSave }) {
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
function S2_Address({ brand, t, onFound, onBack, onCG, onSave }) {
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
function S3_ConfirmHome({ brand, t, lang, property, onConfirm, onEdit, onBack, onCG, onSave }) {
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
function S4_Intent({ brand, t, onSelect, onBack, onCG, onSave }) {
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
function S5_CoolWell({ brand, t, onSelect, onBack, onCG, onSave }) {
  const opts = [
    { id: "yes", label: t.coolYes, blue: true },
    { id: "used_to", label: t.coolUsed, blue: false },
    { id: "struggled", label: t.coolStruggle, blue: false },
    { id: "unsure", label: t.coolNotSure, blue: false },
  ];
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave}>
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
function S6_FloodZone({ brand, t, onSelect, onBack, onCG, onSave }) {
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave}>
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
function S7_SystemAge({ brand, t, onSelect, onBack, onCG, onSave }) {
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave}>
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
function S8_HOA({ brand, t, onSelect, onBack, onCG, onSave }) {
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave}>
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
function S9_SystemType({ brand, t, onSelect, onBack, onCG, onSave }) {
  const opts = [
    { id: "electric", label: t.sysElectric, sub: t.sysElectricSub, blue: true },
    { id: "package", label: t.sysPackage, sub: t.sysPackageSub, blue: false },
    { id: "gas", label: t.sysGas, sub: t.sysGasSub, blue: true },
  ];
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave}>
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

// ── SCREEN 11: ESTIMATE READY ─────────────────────────────────────────────────
function S11_EstimateReady({ brand, t, quote, onChooseFamily, onCG, onSave }) {
  const { property, answers, adderTotal, allEquipment } = quote;
  const homeType = answers.detectedHomeType || property.type || "site-built";
  const tons = QuoteEngine.calcTonnage(property.sqft, answers.coolWell, homeType);
  const priceRange = QuoteEngine.getPriceRange(allEquipment, adderTotal);
  const isManufactured = homeType.toLowerCase().includes("manufactured") || homeType.toLowerCase().includes("mobile");
  const sysLabel = answers.systemType === "electric" 
    ? (isManufactured ? "Package Unit" : "Split Heat Pump")
    : answers.systemType === "package" ? "Package Unit" 
    : "Gas Furnace System";

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack={false} showSave onSave={onSave}>
      <div style={{ padding: "16px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: C.navy, margin: 0 }}>{t.estimateReady}</h1>
      </div>
      <div style={{ margin: "12px 20px 0", background: C.white, borderRadius: 20, padding: "20px", boxShadow: SHADOW, border: `2px solid ${C.blue}` }}>
        {/* House icon */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 48 }}>🏠</span>
        </div>
        <div style={{ textAlign: "center", borderBottom: `1px solid ${C.gray}`, paddingBottom: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: C.blue, fontWeight: 700 }}>Estimated Install Price Range</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: C.navy }}>
            ${priceRange.min.toLocaleString()} – ${priceRange.max.toLocaleString()}
          </div>
        </div>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: C.blue, fontWeight: 700 }}>{t.recommendedSystem}</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>{tons} Ton {sysLabel}</div>
        </div>
        <p style={{ fontSize: 13, color: "#64748b", textAlign: "center", margin: "0 0 12px" }}>{t.priceRangeDesc}</p>
        <GuaranteeBadge t={t} />
        <p style={{ fontSize: 14, fontWeight: 800, color: C.navy, textAlign: "center", margin: "12px 0 0" }}>
          Next, choose a brand family so we can show your specific options.
        </p>
      </div>
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        <BlueBtn onClick={onChooseFamily}>{t.chooseBrandFamily}</BlueBtn>
      </div>
    </Shell>
  );
}

// ── SCREEN 12: CHOOSE BRAND FAMILY ────────────────────────────────────────────
function S12_BrandFamily({ brand, t, quote, onSelect, onBack, onCG, onSave }) {
  const families = [
    { id: "Budget-Friendly", label: t.budgetFriendly, sub: t.budgetFriendlySub, blue: true },
    { id: "Commonly Purchased", label: t.commonlyPurchased, sub: t.commonlyPurchasedSub, blue: false },
    { id: "Trending in 2026", label: t.trending, sub: t.trendingSub, blue: true },
    { id: "Premium Products", label: t.premiumProducts, sub: t.premiumProductsSub, blue: false },
  ];
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{t.chooseFamilyTitle}</h1>
      </div>
      <HeroCard imgSrc="/three-condensers.jpg" overlayText={t.chooseFamilyDesc} />
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {families.map(f => (
          <div key={f.id} style={{ textAlign: "center" }}>
            {f.blue ? <BlueBtn onClick={() => onSelect(f.id)}>{f.label}</BlueBtn> : <WhiteBtn onClick={() => onSelect(f.id)}>{f.label}</WhiteBtn>}
            <p style={{ margin: "4px 0 0", fontSize: 12, color: C.navy, fontWeight: 600 }}>{f.sub}</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}

// ── SCREEN 13: CHOOSE BRAND ───────────────────────────────────────────────────
function S13_ChooseBrand({ brand, t, quote, brandFamily, onSelect, onBack, onCG, onSave }) {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const { property, answers } = quote;
  const tons = QuoteEngine.calcTonnage(property.sqft, answers.coolWell);
  const homeType = answers.detectedHomeType || property.type || "site-built";
  const systemTypes = QuoteEngine.getSystemTypes(answers.systemType, brandFamily, homeType);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const allBrands = new Set();
      for (const st of systemTypes) {
        const eq = await QuoteEngine.fetchEquipment(st, tons, brandFamily);
        eq.forEach(e => { if (e.outdoor_brand) allBrands.add(e.outdoor_brand); });
      }
      setBrands([...allBrands].sort());
      setLoading(false);
    };
    load();
  }, [brandFamily]);

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{t.chooseBrandTitle}</h1>
        <p style={{ fontSize: 13, color: C.navy, fontWeight: 600, margin: "6px 0 0" }}>{t.chooseBrandDesc}</p>
      </div>
      <HeroCard imgSrc="/brands-outdoor.jpg" />
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <NavyBtn onClick={() => onSelect("recommended")}>{t.showRecommended} &gt;</NavyBtn>
        {loading ? (
          <div style={{ textAlign: "center", padding: 20, color: C.blue, fontWeight: 700 }}>Loading brands...</div>
        ) : (
          brands.map(b => (
            <WhiteBtn key={b} onClick={() => onSelect(b)} style={{ textAlign: "left", display: "flex", justifyContent: "space-between" }}>
              <span>{b}</span><span>&gt;</span>
            </WhiteBtn>
          ))
        )}
      </div>
    </Shell>
  );
}

// ── SCREEN 14: EQUIPMENT RESULTS ──────────────────────────────────────────────
function S14_Equipment({ brand, t, quote, brandFamily, selectedBrand, onSelect, onBack, onCG, onSave, onCompareTiers, lang, savedOptions, onToggleSaved, onReviewSaved }) {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sizeNote, setSizeNote] = useState(null);
  const { property, answers, adderTotal } = quote;
  const tons = QuoteEngine.calcTonnage(property.sqft, answers.coolWell);
  const homeType = answers.detectedHomeType || property.type || "site-built";
  const systemTypes = QuoteEngine.getSystemTypes(answers.systemType, brandFamily, homeType);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setSizeNote(null);
      let recResults = [];
      let anyAdjusted = false, finalTons = tons;

      for (const st of systemTypes) {
        // Step up in size automatically if no recommendation exists at the exact requested tonnage
        const ladder = QuoteEngine.TONNAGE_LADDER.filter(sz => sz >= tons);
        for (const trySize of ladder) {
          let rec = await QuoteEngine.fetchEquipment(st, trySize, brandFamily, true, homeType);
          if (selectedBrand !== "recommended") {
            rec = rec.filter(e => e.outdoor_brand === selectedBrand);
          }
          if (rec.length > 0) {
            recResults = [...recResults, ...rec];
            if (trySize !== tons) { anyAdjusted = true; finalTons = trySize; }
            break; // found a size with recommendations for this system type, stop climbing
          }
        }
      }

      if (anyAdjusted) {
        setSizeNote(finalTons);
      }

      recResults.sort((a, b) => a.seer2 - b.seer2);
      setRecommended(recResults.slice(0, 2));
      setLoading(false);
    };
    load();
  }, [brandFamily, selectedBrand]);

  if (loading) return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", border: `4px solid ${C.gray}`, borderTop: `4px solid ${C.blue}`, animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: C.blue, fontWeight: 700 }}>Loading systems...</p>
      </div>
    </Shell>
  );

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{t.recommendationTitle}</h1>
        <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>{brandFamily} · {selectedBrand !== "recommended" ? selectedBrand : "All Brands"}</p>
      </div>
      <div style={{ padding: "12px 20px 0" }}>
        <GuaranteeBadge t={t} />
      </div>

      {sizeNote && (
        <div style={{ padding: "0 20px" }}>
          <div style={{ background: "#fefce8", border: `1.5px solid ${C.amber}`, borderRadius: 12, padding: "10px 14px", marginBottom: 4 }}>
            <p style={{ margin: 0, fontSize: 12, color: "#854d0e", fontWeight: 600, lineHeight: 1.4 }}>
              ℹ️ The exact size wasn't available in this lineup, so we've shown the next size up ({sizeNote} tons) to make sure your home is properly cooled.
            </p>
          </div>
        </div>
      )}

      <div style={{ padding: "8px 20px 0" }}>
        {/* Saved options indicator — visible whenever the customer has saved anything */}
        {savedOptions.length > 0 && (
          <button onClick={onReviewSaved} style={{
            width: "100%", background: `linear-gradient(135deg, ${C.blue}, #0090c8)`, color: C.white,
            border: `2px solid ${C.white}`, borderRadius: 16, padding: "16px 18px", marginBottom: 16,
            cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: "0 6px 18px rgba(0,176,240,0.45)",
            animation: "pulseGlow 2s ease-in-out infinite",
          }}>
            <style>{`
              @keyframes pulseGlow {
                0%, 100% { box-shadow: 0 6px 18px rgba(0,176,240,0.45); }
                50% { box-shadow: 0 6px 24px rgba(0,176,240,0.75); }
              }
            `}</style>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                background: C.white, color: C.blue, borderRadius: "50%",
                width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: 15, flexShrink: 0,
              }}>{savedOptions.length}</span>
              <span style={{ fontWeight: 900, fontSize: 15 }}>
                {lang === "es" ? "Opciones Guardadas" : `Saved Option${savedOptions.length > 1 ? "s" : ""}`}
              </span>
            </span>
            <span style={{ fontWeight: 900, fontSize: 15 }}>{lang === "es" ? "Revisar" : "Review"} →</span>
          </button>
        )}

        {/* Recommended systems — exactly 2, our actual curated picks */}
        {recommended.length > 0 && (
          <div>
            {recommended.map((eq, i) => (
              <EquipmentCard key={eq.id} eq={eq} adders={adderTotal} t={t}
                recommended={true}
                label={i === 0 ? `⭐ ${t.bestValue}` : `⚡ ${t.bestEfficiency}`}
                saved={!!savedOptions.find(s => s.id === eq.id)}
                onSave={onToggleSaved}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}

        {/* Nothing recommended for this brand at any available size */}
        {recommended.length === 0 && (
          <div style={{ textAlign: "center", padding: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ color: C.navy, fontWeight: 700, marginBottom: 4 }}>
              {selectedBrand !== "recommended"
                ? `${selectedBrand} doesn't have a recommended system available for your home's size right now.`
                : "No recommendations found for this combination."}
            </p>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>
              Try a different brand, or ask your Comfort Guide for help finding the right fit.
            </p>
            <BlueBtn onClick={onBack} style={{ marginTop: 8 }}>← Choose a Different Brand</BlueBtn>
          </div>
        )}

        {/* Compare other brand families / price tiers */}
        <div style={{ textAlign: "center", marginTop: 16, marginBottom: 8, display: "flex", flexDirection: "column", gap: 10 }}>
          <WhiteBtn onClick={onBack} style={{ maxWidth: 280, margin: "0 auto" }}>
            {lang === "es" ? "Elegir Otra Marca" : "Choose a Different Brand"} →
          </WhiteBtn>
          <WhiteBtn onClick={onCompareTiers} style={{ maxWidth: 280, margin: "0 auto" }}>
            {lang === "es" ? "Comparar Otras Categorías de Precio" : "Compare Other Price Tiers"} →
          </WhiteBtn>
        </div>
      </div>
    </Shell>
  );
}

// ── SCREEN: REVIEW SAVED OPTIONS ──────────────────────────────────────────────
function ReviewSavedOptions({ brand, t, lang, quote, savedOptions, onToggleSaved, onSelect, onBack, onCG }) {
  const { adderTotal } = quote;

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>
          {lang === "es" ? "Sus Opciones Guardadas" : "Your Saved Options"}
        </h1>
        <p style={{ fontSize: 13, color: "#64748b", margin: "6px 0 0" }}>
          {lang === "es" ? "Compare lado a lado y elija la mejor para usted." : "Compare side by side and choose the best fit for you."}
        </p>
      </div>

      <div style={{ padding: "12px 20px 0" }}>
        <GuaranteeBadge t={t} />
      </div>

      <div style={{ padding: "8px 20px 0" }}>
        {savedOptions.length === 0 ? (
          <div style={{ textAlign: "center", padding: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💾</div>
            <p style={{ color: C.navy, fontWeight: 700, marginBottom: 16 }}>
              {lang === "es" ? "Aún no ha guardado ninguna opción." : "You haven't saved any options yet."}
            </p>
            <BlueBtn onClick={onBack}>{lang === "es" ? "← Volver a Explorar" : "← Back to Browsing"}</BlueBtn>
          </div>
        ) : (
          savedOptions.map(eq => {
            const total = (eq.installation_price || 0) + adderTotal;
            const monthly = Math.round(total / 60);
            return (
              <div key={eq.id} style={{ background: C.white, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: SHADOW, border: `1.5px solid ${C.gray}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 15, color: C.navy }}>{eq.outdoor_brand} {eq.outdoor_series}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      {eq.size_tons} Ton · SEER2 {eq.seer2} · {eq.brand_family}
                    </div>
                  </div>
                  <button onClick={() => onToggleSaved(eq)} style={{ background: "none", border: "none", color: "#dc2626", fontSize: 18, cursor: "pointer", padding: 4 }} title="Remove">✕</button>
                </div>
                {eq.quality_pledge && (
                  <span style={{ display: "inline-block", marginTop: 8, background: "#fef9c3", color: "#92400e", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
                    🛡️ {eq.quality_pledge_years === 999 ? "Lifetime" : `${eq.quality_pledge_years}-Year`} Quality Pledge
                  </span>
                )}
                <div style={{ margin: "12px 0 2px", fontSize: 24, fontWeight: 900, color: C.navy }}>${total.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: C.blue, fontWeight: 700, marginBottom: 12 }}>
                  {lang === "es" ? "Desde" : "As low as"} ${monthly}/mo
                </div>
                <BlueBtn onClick={() => onSelect(eq)}>{t.scheduleThis}</BlueBtn>
              </div>
            );
          })
        )}

        {savedOptions.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 12, marginBottom: 8 }}>
            <WhiteBtn onClick={onBack}>{lang === "es" ? "← Seguir Explorando" : "← Keep Browsing"}</WhiteBtn>
          </div>
        )}
      </div>
    </Shell>
  );
}

// ── SCREEN 15: SYSTEM DETAIL / REVIEW ─────────────────────────────────────────
function S15_SystemDetail({ brand, t, quote, selectedEq, onApprove, onBack, onCG, onSave, lang }) {
  const { adderTotal } = quote;
  const total = (selectedEq.installation_price || 0) + adderTotal;
  const deposit = total * 0.5;
  const monthly = Math.round(total / 60);
  const [emailSent, setEmailSent] = useState(false);
  const [showEmailBox, setShowEmailBox] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleEmailQuote = async () => {
    if (!emailInput.trim()) return;
    setSendingEmail(true);
    setEmailError("");
    try {
      const priceLine = `$${total.toLocaleString()} installed`;
      const sysLine = `${selectedEq.outdoor_brand} ${selectedEq.outdoor_series} (${selectedEq.size_tons} Ton, SEER2 ${selectedEq.seer2})`;
      const r = await fetch("/api/send-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailInput.trim(),
          subject: lang === "es" ? `Su Cotización de ${brand.name}` : `Your ${brand.name} Quote`,
          htmlContent: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color: #163E64;">${lang === "es" ? "Su Cotización" : "Your Quote"}</h2>
              <p>${lang === "es" ? "Aquí está el resumen de su cotización:" : "Here's a summary of your quote:"}</p>
              <div style="background:#f0f9ff; border:2px solid #00B0F0; border-radius:12px; padding:16px; margin:16px 0;">
                <strong>${sysLine}</strong><br/>
                <span style="font-size:24px; font-weight:900; color:#163E64;">${priceLine}</span><br/>
                <span style="font-size:13px; color:#64748b;">${lang === "es" ? "Desde" : "As low as"} $${monthly}/mo</span>
              </div>
              <p>${lang === "es" ? "Esta cotización está garantizada por 45 días." : "This quote is guaranteed for 45 days."}</p>
              <p style="color:#64748b; font-size:13px;">${brand.name}</p>
            </div>
          `,
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setEmailError(data.error || "Could not send — please try again.");
      } else {
        setEmailSent(true);
        setShowEmailBox(false);
        setTimeout(() => setEmailSent(false), 4000);
      }
    } catch(e) {
      setEmailError("Connection issue — please try again.");
    }
    setSendingEmail(false);
  };

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave onSave={onSave}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{t.reviewTitle}</h1>
      </div>
      <div style={{ padding: "12px 20px 0" }}>
        {/* Price card */}
        <div style={{ background: C.white, borderRadius: 16, padding: 20, boxShadow: SHADOW, border: `2px solid ${C.blue}`, marginBottom: 12 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: C.navy }}>${total.toLocaleString()}</div>
            <div style={{ fontSize: 13, color: C.blue, fontWeight: 700 }}>{t.monthlyFrom} ${monthly}{t.perMonth}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>50% deposit due at scheduling: ${deposit.toLocaleString()}</div>
          </div>
        </div>
        <GuaranteeBadge t={t} />
        {/* Equipment specs */}
        <div style={{ background: C.white, borderRadius: 16, padding: 16, boxShadow: SHADOW_SM, marginTop: 12 }}>
          <div style={{ fontWeight: 900, fontSize: 16, color: C.navy, marginBottom: 8 }}>
            {selectedEq.outdoor_brand} {selectedEq.outdoor_series}
          </div>
          {[
            ["AHRI Reference", selectedEq.ahri_ref],
            ["Outdoor Unit", selectedEq.outdoor_model],
            selectedEq.indoor_model ? ["Indoor Unit", selectedEq.indoor_model] : null,
            selectedEq.furnace_model ? ["Furnace", selectedEq.furnace_model] : null,
            ["System Size", `${selectedEq.size_tons} Tons`],
            ["SEER2 Rating", selectedEq.seer2],
            ["Cooling Capacity", `${selectedEq.cooling_capacity?.toLocaleString()} BTU/h`],
            ["Labor Warranty", selectedEq.labor_warranty],
          ].filter(Boolean).map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.gray}`, fontSize: 13 }}>
              <span style={{ color: "#64748b", fontWeight: 600 }}>{label}</span>
              <span style={{ color: C.navy, fontWeight: 700 }}>{val}</span>
            </div>
          ))}
          {/* Badges */}
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {selectedEq.energy_star && <span style={{ background: "#dcfce7", color: C.green, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>⚡ {t.energyStar}</span>}
            {selectedEq.quality_pledge && (
              <span style={{ background: "#fef9c3", color: "#92400e", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                🛡️ {selectedEq.quality_pledge_years === 999 ? "Lifetime" : `${selectedEq.quality_pledge_years}-Year`} {t.qualityPledge}
              </span>
            )}
          </div>
          {/* Quality Pledge detail */}
          {selectedEq.quality_pledge && (
            <div style={{ background: "#fefce8", borderRadius: 10, padding: "10px", marginTop: 10, border: "1px solid #fde68a" }}>
              <div style={{ fontWeight: 800, fontSize: 12, color: "#92400e", marginBottom: 4 }}>
                🛡️ {selectedEq.quality_pledge_years === 999 ? "Lifetime" : `${selectedEq.quality_pledge_years}-Year`} Quality Pledge — Issued by {selectedEq.quality_pledge_issuer}
              </div>
              <div style={{ fontSize: 11, color: "#78350f", lineHeight: 1.5 }}>
                If your compressor fails within the covered period, you choose: a brand new replacement compressor, or complete replacement of the entire outdoor unit. No cost to you.
              </div>
              <div style={{ fontSize: 10, color: "#a16207", marginTop: 6, fontStyle: "italic" }}>
                Applies to manufacturer defects. Excludes abuse, neglect, or natural disaster. Maintenance records may be requested.
              </div>
            </div>
          )}
        </div>
        {/* Parts warranty */}
        <div style={{ background: C.navy, borderRadius: 12, padding: "10px 16px", marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>⚖️</span>
          <div>
            <div style={{ color: C.white, fontWeight: 800, fontSize: 13 }}>{t.partsWarranty}</div>
            <div style={{ color: C.gray, fontSize: 11 }}>{t.partsWarrantyNote}</div>
          </div>
        </div>
        {/* Installation includes */}
        <div style={{ background: C.white, borderRadius: 16, padding: 16, boxShadow: SHADOW_SM, marginTop: 12 }}>
          <div style={{ fontWeight: 900, fontSize: 14, color: C.navy, marginBottom: 10 }}>{t.installation}:</div>
          {t.installItems.map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13, color: C.navy, fontWeight: 600 }}>
              <span style={{ color: C.blue, fontWeight: 900 }}>✓</span>{item}
            </div>
          ))}
        </div>
        {/* Action buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          <BlueBtn onClick={onApprove}>{t.approveQuote}</BlueBtn>

          {!showEmailBox && !emailSent && (
            <WhiteBtn onClick={() => setShowEmailBox(true)}>{t.emailQuote}</WhiteBtn>
          )}

          {showEmailBox && (
            <div style={{ background: C.white, border: `2px solid ${C.blue}`, borderRadius: 14, padding: 14, boxShadow: SHADOW_SM }}>
              <input
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleEmailQuote()}
                placeholder={lang === "es" ? "Su correo electrónico" : "Your email address"}
                type="email"
                style={{ width: "100%", border: `2px solid ${C.gray}`, borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", fontFamily: FONT, marginBottom: 10, boxSizing: "border-box" }}
              />
              {emailError && <p style={{ color: "#dc2626", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{emailError}</p>}
              <div style={{ display: "flex", gap: 8 }}>
                <BlueBtn onClick={handleEmailQuote} disabled={!emailInput.trim() || sendingEmail} style={{ flex: 1, padding: "10px", fontSize: 13 }}>
                  {sendingEmail ? "..." : (lang === "es" ? "Enviar" : "Send")}
                </BlueBtn>
                <WhiteBtn onClick={() => setShowEmailBox(false)} style={{ flex: 1, padding: "10px", fontSize: 13 }}>
                  {lang === "es" ? "Cancelar" : "Cancel"}
                </WhiteBtn>
              </div>
            </div>
          )}

          {emailSent && (
            <div style={{ background: "#dcfce7", border: `2px solid ${C.green}`, borderRadius: 14, padding: "12px", textAlign: "center", color: C.green, fontWeight: 800, fontSize: 14 }}>
              ✓ {lang === "es" ? "¡Cotización Enviada!" : "Quote Sent!"}
            </div>
          )}

          <WhiteBtn onClick={onBack}>{t.reviewMore}</WhiteBtn>
        </div>
      </div>
    </Shell>
  );
}

// ── SCREEN 16: PERSONAL INFO ──────────────────────────────────────────────────
function S16_PersonalInfo({ brand, t, onContinue, onBack, onCG, onSave }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", contactPref: "both" });
  const valid = form.name && form.email && form.phone;
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const inputStyle = {
    width: "100%", border: `2px solid ${C.blue}`, borderRadius: 12,
    padding: "13px 16px", fontSize: 15, outline: "none", fontFamily: FONT,
    boxSizing: "border-box", color: C.navy, fontWeight: 600,
    background: C.white, boxShadow: SHADOW_SM, marginBottom: 12,
  };

  const prefOpts = [
    { id: "text", label: t.prefText },
    { id: "voice", label: t.prefVoice },
    { id: "both", label: t.prefBoth },
  ];

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: C.navy, margin: 0 }}>{t.personalTitle}</h1>
        <p style={{ fontSize: 14, color: C.navy, fontWeight: 600, margin: "6px 0 0" }}>{t.personalDesc}</p>
      </div>
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: C.navy, letterSpacing: 1.5, marginBottom: 6 }}>{t.nameLabel}</div>
        <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="John Smith" style={inputStyle} />
        <div style={{ fontSize: 11, fontWeight: 800, color: C.navy, letterSpacing: 1.5, marginBottom: 6 }}>{t.emailLabel}</div>
        <input value={form.email} onChange={e => set("email", e.target.value)} placeholder="john@example.com" type="email" style={inputStyle} />
        <div style={{ fontSize: 11, fontWeight: 800, color: C.navy, letterSpacing: 1.5, marginBottom: 6 }}>{t.phoneLabel}</div>
        <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(352) 555-0100" type="tel" style={inputStyle} />
        <div style={{ fontSize: 13, fontWeight: 800, color: C.navy, marginBottom: 10 }}>{t.contactPref}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {prefOpts.map(p => (
            <button key={p.id} onClick={() => set("contactPref", p.id)} style={{
              background: form.contactPref === p.id ? C.blue : C.white,
              color: form.contactPref === p.id ? C.white : C.blue,
              border: `2px solid ${C.blue}`, borderRadius: 50,
              padding: "12px 20px", fontWeight: 800, fontSize: 14,
              cursor: "pointer", fontFamily: FONT, boxShadow: SHADOW_SM,
              transition: "all 0.15s",
            }}>{p.label}</button>
          ))}
        </div>
        <BlueBtn onClick={() => valid && onContinue(form)} disabled={!valid}>
          {t.continueToPayment}
        </BlueBtn>
        <p style={{ fontSize: 11, color: "#64748b", textAlign: "center", margin: "10px 0 0", lineHeight: 1.5 }}>
          Your information is private and secure. We will never sell your data or contact you without your permission.
        </p>
      </div>
    </Shell>
  );
}

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

// ── CHECKOUT: CARD PAYMENT FORM (Real Stripe Elements) ────────────────────────
function CheckoutCard({ brand, t, deposit, customerInfo, onSuccess, onBack, onCG }) {
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [cardElement, setCardElement] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const cardRef = useRef(null);

  // Load Stripe.js and create the payment intent
  useEffect(() => {
    loadStripe(async (stripeInst) => {
      setStripe(stripeInst);

      // Create payment intent on the server
      try {
        const r = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: deposit,
            customerEmail: customerInfo?.email,
            customerName: customerInfo?.name,
            description: "Air-Care Connect - AC System Installation Deposit",
            paymentMethodType: "card",
          }),
        });
        const data = await r.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || "Could not initialize payment");
        }
      } catch(e) {
        setError("Could not connect to payment processor");
      }
    });
  }, []);

  // Mount the Stripe card element once we have stripe + clientSecret
  useEffect(() => {
    if (!stripe || !clientSecret || !cardRef.current || cardElement) return;

    const elementsInst = stripe.elements({ clientSecret });
    const card = elementsInst.create("payment");
    card.mount(cardRef.current);
    card.on("ready", () => setReady(true));
    card.on("change", (event) => {
      if (event.error) setError(event.error.message);
      else setError("");
    });

    setElements(elementsInst);
    setCardElement(card);
  }, [stripe, clientSecret]);

  const handlePay = async () => {
    if (!stripe || !elements || processing) return;
    setProcessing(true);
    setError("");

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message || t.cardDeclined);
      setProcessing(false);
      return;
    }

    setProcessing(false);
    onSuccess({ method: "card", holdHours: 0 }); // instant lock on success
  };

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{t.cardFormTitle}</h1>
        <div style={{ fontSize: 24, fontWeight: 900, color: C.blue, margin: "10px 0" }}>${deposit.toLocaleString()}</div>
      </div>

      <div style={{ padding: "8px 20px 0" }}>
        <div style={{
          background: C.white, border: `2px solid ${C.blue}`, borderRadius: 12,
          padding: "16px", marginBottom: 14, boxShadow: SHADOW_SM, minHeight: 50,
        }}>
          {!ready && !error && (
            <div style={{ textAlign: "center", color: C.blue, fontWeight: 600, fontSize: 13 }}>
              Loading secure payment form...
            </div>
          )}
          <div ref={cardRef} />
        </div>

        {error && <p style={{ color: "#dc2626", fontSize: 13, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>{error}</p>}

        <BlueBtn onClick={handlePay} disabled={!ready || processing} style={{ marginTop: 8 }}>
          {processing ? t.processingPayment : `${t.payNow} - $${deposit.toLocaleString()}`}
        </BlueBtn>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16 }}>
          <span style={{ fontSize: 16 }}>{"\uD83D\uDD12"}</span>
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Secured by Stripe — your card details are encrypted</span>
        </div>
      </div>
    </Shell>
  );
}

// ── CHECKOUT: ACH BANK PAYMENT FORM ───────────────────────────────────────────
function CheckoutACH({ brand, t, deposit, onSuccess, onBack, onCG }) {
  const [form, setForm] = useState({ routing: "", account: "", accountType: "checking" });
  const [processing, setProcessing] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const valid = form.routing.length === 9 && form.account.length >= 4;

  const handleSubmit = async () => {
    if (!valid) return;
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1800));
    setProcessing(false);
    onSuccess({ method: "ach", holdHours: 24 });
  };

  const inputStyle = {
    width: "100%", border: `2px solid ${C.blue}`, borderRadius: 12,
    padding: "13px 16px", fontSize: 15, outline: "none", fontFamily: FONT,
    boxSizing: "border-box", color: C.navy, fontWeight: 600,
    background: C.white, boxShadow: SHADOW_SM, marginBottom: 12,
  };

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{t.achFormTitle}</h1>
        <div style={{ fontSize: 24, fontWeight: 900, color: C.blue, margin: "10px 0" }}>${deposit.toLocaleString()}</div>
      </div>

      <div style={{ padding: "8px 20px 0" }}>
        <input value={form.routing} onChange={e => set("routing", e.target.value.replace(/\D/g,"").slice(0,9))}
          placeholder={t.achRouting} inputMode="numeric" style={inputStyle} />
        <input value={form.account} onChange={e => set("account", e.target.value.replace(/\D/g,"").slice(0,17))}
          placeholder={t.achAccount} inputMode="numeric" style={inputStyle} />

        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          {["checking","savings"].map(type => (
            <button key={type} onClick={() => set("accountType", type)} style={{
              flex: 1, background: form.accountType === type ? C.blue : C.white,
              color: form.accountType === type ? C.white : C.blue,
              border: `2px solid ${C.blue}`, borderRadius: 50, padding: "10px",
              fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: FONT,
            }}>{type === "checking" ? t.achChecking : t.achSavings}</button>
          ))}
        </div>

        <div style={{ background: "#f0f9ff", borderRadius: 10, padding: "10px 14px", marginBottom: 14, border: `1px solid ${C.blue}` }}>
          <p style={{ margin: 0, fontSize: 12, color: C.navy, fontWeight: 600, lineHeight: 1.5 }}>
            {t.achPending}
          </p>
        </div>

        <BlueBtn onClick={handleSubmit} disabled={!valid || processing}>
          {processing ? t.processingPayment : t.achSubmit}
        </BlueBtn>
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
function CheckoutCalendar({ brand, t, paymentInfo, onConfirm, onBack, onCG }) {
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthOffset, setMonthOffset] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await sb.get("availability", "is_open=eq.true&order=available_date.asc");
        setAvailableDates(data.filter(d => d.booked_slots < d.max_slots));
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
    const dt = new Date(d.available_date);
    return dt.getMonth() === viewMonth.getMonth() && dt.getFullYear() === viewMonth.getFullYear();
  });

  const monthName = viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack}>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{t.calendarTitle}</h1>
        <p style={{ fontSize: 13, color: "#64748b", margin: "8px 0 0" }}>{t.calendarDesc}</p>
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
              const dt = new Date(d.available_date);
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
            {t.confirmDate} — {new Date(selectedDate.available_date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </BlueBtn>
        )}
      </div>
    </Shell>
  );
}

// ── CHECKOUT: CONFIRMATION ─────────────────────────────────────────────────────
function CheckoutConfirmation({ brand, t, bookingRef, installDate, customerInfo, onDone }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: FONT, maxWidth: 430, margin: "0 auto" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div style={{
          width: 90, height: 90, borderRadius: "50%", background: C.green,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 48, color: C.white, marginBottom: 20, boxShadow: SHADOW,
        }}>✓</div>

        <h1 style={{ fontSize: 24, fontWeight: 900, color: C.navy, margin: "0 0 8px" }}>{t.confirmationTitle}</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 24, maxWidth: 320 }}>{t.confirmationDesc}</p>

        <div style={{ background: C.white, borderRadius: 16, padding: 20, boxShadow: SHADOW, width: "100%", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.gray}` }}>
            <span style={{ color: "#64748b", fontWeight: 600, fontSize: 13 }}>{t.bookingRef}</span>
            <span style={{ color: C.navy, fontWeight: 900, fontSize: 13 }}>{bookingRef}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
            <span style={{ color: "#64748b", fontWeight: 600, fontSize: 13 }}>{t.installDate}</span>
            <span style={{ color: C.navy, fontWeight: 900, fontSize: 13 }}>
              {new Date(installDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>
        </div>

        <div style={{ background: C.white, borderRadius: 16, padding: 18, boxShadow: SHADOW_SM, width: "100%", marginBottom: 24, textAlign: "left" }}>
          <div style={{ fontWeight: 900, fontSize: 14, color: C.navy, marginBottom: 10 }}>{t.whatNext}</div>
          {[t.nextStep1, t.nextStep2, t.nextStep3].map((step, i) => (
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
export default function App() {
  const [lang, setLang] = useState("en");
  const [screen, setScreen] = useState("s1");
  const [property, setProperty] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quote, setQuote] = useState(null);
  const [brandFamily, setBrandFamily] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedEq, setSelectedEq] = useState(null);
  const [savedOptions, setSavedOptions] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [bookingRef, setBookingRef] = useState(null);
  const [installDate, setInstallDate] = useState(null);
  const [showCG, setShowCG] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [resumeChecked, setResumeChecked] = useState(false);

  const brand = BRAND[lang];
  const t = T[lang];
  const go = s => setScreen(s);
  const ans = (k, v) => setAnswers(p => ({ ...p, [k]: v }));
  const toggleSavedOption = (eq) => {
    setSavedOptions(p => p.find(s => s.id === eq.id) ? p.filter(s => s.id !== eq.id) : [...p, eq]);
  };

  // Build a full snapshot of current state for saving/auto-save
  const buildStateSnapshot = () => ({
    lang, screen, property, answers, quote, brandFamily,
    selectedBrand, selectedEq, customerInfo,
  });

  // Restore state from a snapshot (used by both localStorage resume and email link resume)
  const restoreFromSnapshot = (snap) => {
    if (!snap) return;
    if (snap.lang) setLang(snap.lang);
    if (snap.property) setProperty(snap.property);
    if (snap.answers) setAnswers(snap.answers);
    if (snap.quote) setQuote(snap.quote);
    if (snap.brandFamily) setBrandFamily(snap.brandFamily);
    if (snap.selectedBrand) setSelectedBrand(snap.selectedBrand);
    if (snap.selectedEq) setSelectedEq(snap.selectedEq);
    if (snap.customerInfo) setCustomerInfo(snap.customerInfo);
    if (snap.screen) setScreen(snap.screen);
  };

  // Auto-save to localStorage on every meaningful state change (after landing screen)
  // Skip entirely on s1 (nothing to save) and on confirmation (booking is done — clear instead)
  useEffect(() => {
    if (!resumeChecked) return;
    if (screen === "s1") return;
    try {
      if (screen === "confirmation") {
        localStorage.removeItem("acc_progress");
      } else {
        localStorage.setItem("acc_progress", JSON.stringify(buildStateSnapshot()));
      }
    } catch(e) {}
  }, [screen, property, answers, quote, brandFamily, selectedBrand, selectedEq, customerInfo, resumeChecked]);

  // On first load: check for email-link resume token, then fall back to localStorage
  useEffect(() => {
    const checkResume = async () => {
      const params = new URLSearchParams(window.location.search);
      const resumeToken = params.get("resume");

      if (resumeToken) {
        try {
          const r = await fetch(`/api/resume-progress?token=${resumeToken}`);
          const data = await r.json();
          if (data.stateSnapshot && !data.expired) {
            restoreFromSnapshot(data.stateSnapshot);
            // Clean the URL so refreshing doesn't re-trigger this
            window.history.replaceState({}, "", window.location.pathname);
            setResumeChecked(true);
            return;
          }
        } catch(e) { console.warn("Resume link error:", e); }
      }

      // Fall back to localStorage auto-save
      try {
        const saved = localStorage.getItem("acc_progress");
        if (saved) {
          const snap = JSON.parse(saved);
          restoreFromSnapshot(snap);
        }
      } catch(e) {}
      setResumeChecked(true);
    };
    checkResume();
  }, []);

  // Actually save progress + send resume link email
  const saveProgressNow = async (email, name) => {
    const snapshot = buildStateSnapshot();
    const r = await fetch("/api/save-progress", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, stateSnapshot: snapshot, lang }),
    });
    const data = await r.json();
    if (!data.success) throw new Error(data.error || "Save failed");
    if (!customerInfo?.email) {
      setCustomerInfo(p => ({ ...(p || {}), email, name: name || p?.name }));
    }
  };

  // Build quote object with adder calculation
  const buildQuote = useCallback(async (prop, curAnswers) => {
    try {
      const { total: adderTotal } = QuoteEngine.calcAdders(curAnswers);
      const homeType = curAnswers.detectedHomeType || prop.type || "site-built";
      const tons = QuoteEngine.calcTonnage(prop.sqft, curAnswers.coolWell, homeType);
      const systemTypes = QuoteEngine.getSystemTypes(curAnswers.systemType, null, homeType);

      console.log("buildQuote:", { homeType, tons, systemTypes, sqft: prop.sqft });

      // Fetch all equipment for price range
      let allEquipment = [];
      for (const st of systemTypes) {
        const eq = await QuoteEngine.fetchEquipment(st, tons, null, false, homeType);
        console.log(`  fetched ${eq.length} rows for system_type=${st}, tons=${tons}`);
        allEquipment = [...allEquipment, ...eq];
      }

      console.log("buildQuote total equipment found:", allEquipment.length);
      setQuote({ property: prop, answers: curAnswers, adderTotal, allEquipment, tons });
    } catch (err) {
      console.error("buildQuote failed:", err);
      setQuote(null);
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#b0d8ec" }}>
      <FontLoader />
      <LangToggle lang={lang} setLang={setLang} />
      {showCG && <ComfortGuide lang={lang} brand={brand} t={t} onClose={() => setShowCG(false)}
        customerContext={{
          screen, property, answers,
          tons: quote?.tons, adderTotal: quote?.adderTotal,
          brandFamily, selectedEq,
        }} />}

      {showSaveModal && (
        <SaveProgressModal t={t} lang={lang} customerInfo={customerInfo}
          onClose={() => setShowSaveModal(false)}
          onSaved={saveProgressNow} />
      )}

      {screen === "s1" && <S1_Landing brand={brand} t={t} onStart={() => go("s2")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />}

      {screen === "s2" && <S2_Address brand={brand} t={t}
        onFound={p => { setProperty(p); go("s3"); }}
        onBack={() => go("s1")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />}

      {screen === "s3" && <S3_ConfirmHome brand={brand} t={t} lang={lang} property={property}
        onConfirm={(verified) => {
          if (verified) {
            setProperty(verified);
            // Auto-detect home type from property data
            const type = verified.type || "";
            const isManufactured = type.toLowerCase().includes("manufactured") || 
                                   type.toLowerCase().includes("mobile");
            const isApt = type.toLowerCase().includes("condo") || 
                          type.toLowerCase().includes("apartment") ||
                          type.toLowerCase().includes("multi");
            setAnswers(p => ({ 
              ...p, 
              detectedHomeType: isManufactured ? "manufactured" : isApt ? "apartment" : "site-built",
              detectedSqft: verified.sqft || p.detectedSqft,
            }));
          }
          go("s4");
        }}
        onEdit={() => go("s2")} onBack={() => go("s2")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />}

      {screen === "s4" && <S4_Intent brand={brand} t={t}
        onSelect={id => {
          if (id === "guide") { setShowCG(true); return; }
          if (id === "minisplit") { alert("Mini-split path — Phase 2"); return; }
          go("s5");
        }}
        onBack={() => go("s3")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />}

      {screen === "s5" && <S5_CoolWell brand={brand} t={t}
        onSelect={v => { ans("coolWell", v); go("s6"); }}
        onBack={() => go("s4")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />}

      {screen === "s6" && <S6_FloodZone brand={brand} t={t}
        onSelect={v => { ans("floodZone", v); go("s7"); }}
        onBack={() => go("s5")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />}

      {screen === "s7" && <S7_SystemAge brand={brand} t={t}
        onSelect={v => { ans("systemAge", v); go("s8"); }}
        onBack={() => go("s6")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />}

      {screen === "s8" && <S8_HOA brand={brand} t={t}
        onSelect={v => { ans("hoa", v); go("s9"); }}
        onBack={() => go("s7")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />}

      {screen === "s9" && <S9_SystemType brand={brand} t={t}
        onSelect={v => {
          const newAnswers = { ...answers, systemType: v };
          setAnswers(newAnswers);
          go("s10");
          buildQuote(property, newAnswers);
        }}
        onBack={() => go("s8")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />}

      {screen === "s10" && <S10_Preparing brand={brand} t={t} onDone={() => go("s11")} quoteReady={!!quote} />}

      {screen === "s11" && quote && <S11_EstimateReady brand={brand} t={t} quote={quote}
        onChooseFamily={() => go("s12")}
        onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />}
      {screen === "s11" && !quote && (
        <Shell t={t} brand={brand} onCG={() => setShowCG(true)} showBack onBack={() => go("s9")}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontWeight: 900, color: C.navy, marginBottom: 8 }}>We hit a snag</h2>
            <p style={{ color: "#64748b", marginBottom: 24 }}>We could not load your estimate. This is usually temporary — please try again.</p>
            <BlueBtn onClick={() => { setScreen("s9"); }} style={{ maxWidth: 240 }}>← Try Again</BlueBtn>
          </div>
        </Shell>
      )}

      {screen === "s12" && <S12_BrandFamily brand={brand} t={t} quote={quote}
        onSelect={f => { setBrandFamily(f); go("s13"); }}
        onBack={() => go("s11")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />}

      {screen === "s13" && <S13_ChooseBrand brand={brand} t={t} quote={quote} brandFamily={brandFamily}
        onSelect={b => { setSelectedBrand(b); go("s14"); }}
        onBack={() => go("s12")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />}

      {screen === "s14" && <S14_Equipment brand={brand} t={t} quote={quote} lang={lang}
        brandFamily={brandFamily} selectedBrand={selectedBrand}
        savedOptions={savedOptions} onToggleSaved={toggleSavedOption} onReviewSaved={() => go("savedReview")}
        onSelect={eq => { setSelectedEq(eq); go("s15"); }}
        onCompareTiers={() => go("s12")}
        onBack={() => go("s13")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />}

      {screen === "savedReview" && (
        <ReviewSavedOptions brand={brand} t={t} lang={lang} quote={quote}
          savedOptions={savedOptions} onToggleSaved={toggleSavedOption}
          onSelect={eq => { setSelectedEq(eq); go("s15"); }}
          onBack={() => go("s14")} onCG={() => setShowCG(true)} />
      )}
      {screen === "s15" && selectedEq && <S15_SystemDetail brand={brand} t={t} quote={quote} lang={lang}
        selectedEq={selectedEq}
        onApprove={() => go("s16")}
        onBack={() => go("s14")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />}

      {screen === "s16" && <S16_PersonalInfo brand={brand} t={t}
        onContinue={info => { setCustomerInfo(info); go("checkout"); }}
        onBack={() => go("s15")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />}

      {screen === "checkout" && selectedEq && quote && (
        <CheckoutPayment brand={brand} t={t} quote={quote} selectedEq={selectedEq} customerInfo={customerInfo}
          onSelectMethod={method => go(`pay_${method}`)}
          onBack={() => go("s16")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />
      )}

      {screen === "pay_card" && selectedEq && (
        <CheckoutCard brand={brand} t={t}
          deposit={Math.round(((selectedEq.installation_price || 0) + (quote.adderTotal || 0)) * 0.5)}
          customerInfo={customerInfo}
          onSuccess={info => { setPaymentInfo(info); go("schedule"); }}
          onBack={() => go("checkout")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />
      )}

      {screen === "pay_ach" && selectedEq && (
        <CheckoutACH brand={brand} t={t}
          deposit={Math.round(((selectedEq.installation_price || 0) + (quote.adderTotal || 0)) * 0.5)}
          onSuccess={info => { setPaymentInfo(info); go("schedule"); }}
          onBack={() => go("checkout")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />
      )}

      {screen === "pay_ftl" && selectedEq && (
        <CheckoutFTL brand={brand} t={t}
          total={(selectedEq.installation_price || 0) + (quote.adderTotal || 0)}
          customerInfo={customerInfo}
          onSuccess={info => { setPaymentInfo(info); go("schedule"); }}
          onBack={() => go("checkout")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />
      )}

      {screen === "pay_microf" && selectedEq && (
        <CheckoutMicrof brand={brand} t={t}
          total={(selectedEq.installation_price || 0) + (quote.adderTotal || 0)}
          customerInfo={customerInfo}
          onSuccess={info => { setPaymentInfo(info); go("schedule"); }}
          onBack={() => go("checkout")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />
      )}

      {screen === "schedule" && (
        <CheckoutCalendar brand={brand} t={t} paymentInfo={paymentInfo}
          onConfirm={async (date) => {
            setInstallDate(date.available_date);

            const total = (selectedEq?.installation_price || 0) + (quote?.adderTotal || 0);
            const isFinancing = paymentInfo?.method === "ftl" || paymentInfo?.method === "microf";

            try {
              const bookingPayload = {
                customer_name: customerInfo?.name || null,
                customer_email: customerInfo?.email || null,
                customer_phone: customerInfo?.phone || null,
                contact_preference: customerInfo?.contactPref || null,
                install_date: date.available_date,
                install_address: property?.address || null,
                payment_method: paymentInfo?.method || null,
                payment_status: isFinancing ? "pending" : "deposit_paid",
                deposit_amount: isFinancing ? 0 : Math.round(total * 0.5),
                financing_company: isFinancing ? paymentInfo.method : null,
                financing_status: isFinancing ? "pending" : "not_applicable",
                financing_applied_at: isFinancing ? new Date().toISOString() : null,
                slot_held_until: new Date(Date.now() + (paymentInfo?.holdHours || 0) * 3600000).toISOString(),
                booking_status: "confirmed",
                organization_id: 1,
              };

              const r = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
                method: "POST",
                headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json", Prefer: "return=representation" },
                body: JSON.stringify(bookingPayload),
              });
              const data = await r.json();
              const created = Array.isArray(data) ? data[0] : data;

              setBookingRef(created?.booking_reference || `ACB-${new Date().getFullYear()}-PENDING`);

              // Mark the availability slot as booked
              if (date.available_date) {
                await fetch(`${SUPABASE_URL}/rest/v1/availability?available_date=eq.${date.available_date}`, {
                  method: "PATCH",
                  headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
                  body: JSON.stringify({ booked_slots: (date.booked_slots || 0) + 1 }),
                });
              }
            } catch(e) {
              console.error("Booking creation error:", e);
              setBookingRef(`ACB-${new Date().getFullYear()}-${String(Math.floor(Math.random()*99999)).padStart(5,"0")}`);
            }

            go("confirmation");
          }}
          onBack={() => go("checkout")} onCG={() => setShowCG(true)} onSave={() => setShowSaveModal(true)} />
      )}

      {screen === "confirmation" && (
        <CheckoutConfirmation brand={brand} t={t} bookingRef={bookingRef} installDate={installDate} customerInfo={customerInfo}
          onDone={() => {
            try { localStorage.removeItem("acc_progress"); } catch(e) {}
            setScreen("s1"); setProperty(null); setAnswers({}); setQuote(null);
            setBrandFamily(null); setSelectedBrand(null); setSelectedEq(null);
            setCustomerInfo(null); setPaymentInfo(null); setBookingRef(null); setInstallDate(null);
          }} />
      )}
    </div>
  );
}

