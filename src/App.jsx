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
          {saved ? (lang === "es" ? "✓ Guardado" : "✓ Saved") : t.saveOption}
        </WhiteBtn>
      </div>
    </div>
  );
}

// ── COMFORT GUIDE ─────────────────────────────────────────────────────────────
function ComfortGuide({ lang, brand, t, onClose }) {
  const [msgs, setMsgs] = useState([{ role: "assistant", content: t.cgWelcome }]);
  const [input, setInput] = useState(""); const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

  const send = async () => {
    if (!input.trim() || busy) return;
    const next = [...msgs, { role: "user", content: input.trim() }];
    setMsgs(next); setInput(""); setBusy(true);
    try {
      const sys = lang === "en"
        ? `You are the Comfort Guide for Air-Care Connect, a professional HVAC replacement service in Central Florida (Marion, Lake, Sumter, Levy, Citrus, Alachua Counties + The Villages). Help customers with AC replacement, equipment types, SEER ratings, brands (Goodman, Nortek, Ducane, Bryant, Carrier, etc.), financing (FTL, Affirm, ACH, credit card). Key facts: 45-day price guarantee. Installation always includes: equipment, concrete pad, new copper refrigerant lines, hurricane clips, float switch, UV light, 2" filter rack, labor, permits, old system haul-away. Two techs per job. No after-hours surcharge. 50% deposit at booking (waived for FTL). Quality Pledge: Nortek brands offer 1-10 year pledge, Goodman offers Lifetime — customer chooses new compressor OR entire outdoor unit replacement. Be warm, concise, reassuring. Never pushy.`
        : `Eres el Guía de Confort de Aire Azul en el Centro de Florida. Ayuda con reemplazo de AC, tipos de equipo, SEER, marcas, financiamiento (FTL, Affirm, ACH, tarjeta). Garantía 45 días. La instalación incluye todo. Dos técnicos. Sin recargo nocturno. 50% depósito (sin depósito con FTL). Responde en español. Sé cálido y conciso.`;
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: sys, messages: next.map(m => ({ role: m.role, content: m.content })) }),
      });
      const d = await r.json();
      setMsgs(p => [...p, { role: "assistant", content: d.content?.[0]?.text || "Please try again." }]);
    } catch { setMsgs(p => [...p, { role: "assistant", content: "Connection issue — please try again." }]); }
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
function S1_Landing({ brand, t, onStart, onCG }) {
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
function S2_Address({ brand, t, onFound, onBack, onCG }) {
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
function S3_ConfirmHome({ brand, t, property, onConfirm, onEdit, onBack, onCG }) {
  const [propData, setPropData] = useState(property);
  const [loadingProp, setLoadingProp] = useState(true);
  const [streetViewError, setStreetViewError] = useState(false);

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
              { v: propData.beds, l: t.beds },
              { v: propData.baths, l: t.baths },
              { v: propData.sqft?.toLocaleString(), l: t.sqft },
            ].map(({ v, l }) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: C.white }}>{v || "—"}</div>
                <div style={{ fontSize: 11, color: C.gray, fontWeight: 700 }}>{l}</div>
              </div>
            ))}
          </div>
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
          💡 Home details are pulled from public property records. If anything looks incorrect, tap <strong>"Edit Home Details"</strong> to make corrections before we calculate your estimate.
        </p>
      </div>

      <div style={{ padding: "14px 20px 0", display: "flex", gap: 12 }}>
        <BlueBtn onClick={() => onConfirm(propData)} style={{ flex: 1 }}>{t.confirmBtn}</BlueBtn>
        <WhiteBtn onClick={onEdit} style={{ flex: 1 }}>{t.editBtn}</WhiteBtn>
      </div>
      <div style={{ padding: "10px 20px 0" }}>
        <TrustRow items={[t.noApptShort, t.noCallShort]} />
      </div>
    </Shell>
  );
}

// ── SCREEN 4: INTENT ──────────────────────────────────────────────────────────
function S4_Intent({ brand, t, onSelect, onBack, onCG }) {
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
function S5_CoolWell({ brand, t, onSelect, onBack, onCG }) {
  const opts = [
    { id: "yes", label: t.coolYes, blue: true },
    { id: "used_to", label: t.coolUsed, blue: false },
    { id: "struggled", label: t.coolStruggle, blue: false },
    { id: "unsure", label: t.coolNotSure, blue: false },
  ];
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave>
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
function S6_FloodZone({ brand, t, onSelect, onBack, onCG }) {
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave>
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
function S7_SystemAge({ brand, t, onSelect, onBack, onCG }) {
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave>
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
function S8_HOA({ brand, t, onSelect, onBack, onCG }) {
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave>
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
function S9_SystemType({ brand, t, onSelect, onBack, onCG }) {
  const opts = [
    { id: "electric", label: t.sysElectric, sub: t.sysElectricSub, blue: true },
    { id: "package", label: t.sysPackage, sub: t.sysPackageSub, blue: false },
    { id: "gas", label: t.sysGas, sub: t.sysGasSub, blue: true },
  ];
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave>
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
function S11_EstimateReady({ brand, t, quote, onChooseFamily, onCG }) {
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
    <Shell t={t} brand={brand} onCG={onCG} showBack={false} showSave>
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
function S12_BrandFamily({ brand, t, quote, onSelect, onBack, onCG }) {
  const families = [
    { id: "Budget-Friendly", label: t.budgetFriendly, sub: t.budgetFriendlySub, blue: true },
    { id: "Commonly Purchased", label: t.commonlyPurchased, sub: t.commonlyPurchasedSub, blue: false },
    { id: "Trending in 2026", label: t.trending, sub: t.trendingSub, blue: true },
    { id: "Premium Products", label: t.premiumProducts, sub: t.premiumProductsSub, blue: false },
  ];
  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave>
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
function S13_ChooseBrand({ brand, t, quote, brandFamily, onSelect, onBack, onCG }) {
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
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave>
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
function S14_Equipment({ brand, t, quote, brandFamily, selectedBrand, onSelect, onBack, onCG }) {
  const [equipment, setEquipment] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);
  const { property, answers, adderTotal } = quote;
  const tons = QuoteEngine.calcTonnage(property.sqft, answers.coolWell);
  const homeType = answers.detectedHomeType || property.type || "site-built";
  const systemTypes = QuoteEngine.getSystemTypes(answers.systemType, brandFamily, homeType);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let recResults = [], allResults = [];
      for (const st of systemTypes) {
        const rec = await QuoteEngine.fetchEquipment(st, tons, brandFamily, true);
        const all = await QuoteEngine.fetchEquipment(st, tons, brandFamily, false);
        recResults = [...recResults, ...rec];
        allResults = [...allResults, ...all];
      }
      // Filter by brand if specific brand selected
      if (selectedBrand !== "recommended") {
        allResults = allResults.filter(e => e.outdoor_brand === selectedBrand);
        recResults = recResults.filter(e => e.outdoor_brand === selectedBrand);
      }
      // Sort recommended: lowest SEER first, highest SEER last
      recResults.sort((a, b) => a.seer2 - b.seer2);
      setRecommended(recResults.slice(0, 2));
      setEquipment(allResults.filter(e => !recResults.slice(0,2).find(r => r.id === e.id)));
      setLoading(false);
    };
    load();
  }, [brandFamily, selectedBrand]);

  const toggleSave = (eq) => {
    setSavedIds(p => p.includes(eq.id) ? p.filter(id => id !== eq.id) : [...p, eq.id]);
  };

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
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave>
      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: 0 }}>{t.recommendationTitle}</h1>
        <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>{brandFamily} · {selectedBrand !== "recommended" ? selectedBrand : "All Brands"}</p>
      </div>
      <div style={{ padding: "12px 20px 0" }}>
        <GuaranteeBadge t={t} />
      </div>
      <div style={{ padding: "8px 20px 0" }}>
        {/* Recommended systems */}
        {recommended.length > 0 && (
          <div>
            {recommended.map((eq, i) => (
              <EquipmentCard key={eq.id} eq={eq} adders={adderTotal} t={t}
                recommended={true}
                label={i === 0 ? `⭐ ${t.bestValue}` : `⚡ ${t.bestEfficiency}`}
                saved={savedIds.includes(eq.id)}
                onSave={toggleSave}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
        {/* See More Options button - leads back to brand selection */}
        {equipment.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 8, marginBottom: 8 }}>
            <WhiteBtn onClick={onBack} style={{ maxWidth: 280, margin: "0 auto" }}>
              {t.seeMore} →
            </WhiteBtn>
          </div>
        )}
        {recommended.length === 0 && equipment.length === 0 && (
          <div style={{ textAlign: "center", padding: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ color: C.navy, fontWeight: 700 }}>No systems found for this combination. Try a different brand family.</p>
            <BlueBtn onClick={onBack} style={{ marginTop: 16 }}>← Choose Different Family</BlueBtn>
          </div>
        )}
      </div>
    </Shell>
  );
}

// ── SCREEN 15: SYSTEM DETAIL / REVIEW ─────────────────────────────────────────
function S15_SystemDetail({ brand, t, quote, selectedEq, onApprove, onBack, onCG }) {
  const { adderTotal } = quote;
  const total = (selectedEq.installation_price || 0) + adderTotal;
  const deposit = total * 0.5;
  const monthly = Math.round(total / 60);
  const [emailSent, setEmailSent] = useState(false);

  return (
    <Shell t={t} brand={brand} onCG={onCG} showBack onBack={onBack} showSave>
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
          <WhiteBtn onClick={() => { setEmailSent(true); setTimeout(() => setEmailSent(false), 3000); }}>
            {emailSent ? "✓ Quote Sent!" : t.emailQuote}
          </WhiteBtn>
          <WhiteBtn onClick={onBack}>{t.reviewMore}</WhiteBtn>
        </div>
      </div>
    </Shell>
  );
}

// ── SCREEN 16: PERSONAL INFO ──────────────────────────────────────────────────
function S16_PersonalInfo({ brand, t, onContinue, onBack, onCG }) {
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
    { id: "affirm", label: t.payAffirm, sub: t.payAffirmSub, icon: "calendar_pay", deposit: 0, blue: true },
  ];

  const icons = {
    card_credit_card: "\uD83D\uDCB3",
    bank: "\uD83C\uDFE6",
    doc: "\uD83D\uDCCB",
    house_lease: "\uD83C\uDFE0",
    calendar_pay: "\uD83D\uDCC5",
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
  const [customerInfo, setCustomerInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [bookingRef, setBookingRef] = useState(null);
  const [installDate, setInstallDate] = useState(null);
  const [showCG, setShowCG] = useState(false);

  const brand = BRAND[lang];
  const t = T[lang];
  const go = s => setScreen(s);
  const ans = (k, v) => setAnswers(p => ({ ...p, [k]: v }));

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
      {showCG && <ComfortGuide lang={lang} brand={brand} t={t} onClose={() => setShowCG(false)} />}

      {screen === "s1" && <S1_Landing brand={brand} t={t} onStart={() => go("s2")} onCG={() => setShowCG(true)} />}

      {screen === "s2" && <S2_Address brand={brand} t={t}
        onFound={p => { setProperty(p); go("s3"); }}
        onBack={() => go("s1")} onCG={() => setShowCG(true)} />}

      {screen === "s3" && <S3_ConfirmHome brand={brand} t={t} property={property}
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
        onEdit={() => go("s2")} onBack={() => go("s2")} onCG={() => setShowCG(true)} />}

      {screen === "s4" && <S4_Intent brand={brand} t={t}
        onSelect={id => {
          if (id === "guide") { setShowCG(true); return; }
          if (id === "minisplit") { alert("Mini-split path — Phase 2"); return; }
          go("s5");
        }}
        onBack={() => go("s3")} onCG={() => setShowCG(true)} />}

      {screen === "s5" && <S5_CoolWell brand={brand} t={t}
        onSelect={v => { ans("coolWell", v); go("s6"); }}
        onBack={() => go("s4")} onCG={() => setShowCG(true)} />}

      {screen === "s6" && <S6_FloodZone brand={brand} t={t}
        onSelect={v => { ans("floodZone", v); go("s7"); }}
        onBack={() => go("s5")} onCG={() => setShowCG(true)} />}

      {screen === "s7" && <S7_SystemAge brand={brand} t={t}
        onSelect={v => { ans("systemAge", v); go("s8"); }}
        onBack={() => go("s6")} onCG={() => setShowCG(true)} />}

      {screen === "s8" && <S8_HOA brand={brand} t={t}
        onSelect={v => { ans("hoa", v); go("s9"); }}
        onBack={() => go("s7")} onCG={() => setShowCG(true)} />}

      {screen === "s9" && <S9_SystemType brand={brand} t={t}
        onSelect={v => {
          const newAnswers = { ...answers, systemType: v };
          setAnswers(newAnswers);
          go("s10");
          buildQuote(property, newAnswers);
        }}
        onBack={() => go("s8")} onCG={() => setShowCG(true)} />}

      {screen === "s10" && <S10_Preparing brand={brand} t={t} onDone={() => go("s11")} quoteReady={!!quote} />}

      {screen === "s11" && quote && <S11_EstimateReady brand={brand} t={t} quote={quote}
        onChooseFamily={() => go("s12")}
        onCG={() => setShowCG(true)} />}
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
        onBack={() => go("s11")} onCG={() => setShowCG(true)} />}

      {screen === "s13" && <S13_ChooseBrand brand={brand} t={t} quote={quote} brandFamily={brandFamily}
        onSelect={b => { setSelectedBrand(b); go("s14"); }}
        onBack={() => go("s12")} onCG={() => setShowCG(true)} />}

      {screen === "s14" && <S14_Equipment brand={brand} t={t} quote={quote}
        brandFamily={brandFamily} selectedBrand={selectedBrand}
        onSelect={eq => { setSelectedEq(eq); go("s15"); }}
        onBack={() => go("s13")} onCG={() => setShowCG(true)} />}

      {screen === "s15" && selectedEq && <S15_SystemDetail brand={brand} t={t} quote={quote}
        selectedEq={selectedEq}
        onApprove={() => go("s16")}
        onBack={() => go("s14")} onCG={() => setShowCG(true)} />}

      {screen === "s16" && <S16_PersonalInfo brand={brand} t={t}
        onContinue={info => { setCustomerInfo(info); go("checkout"); }}
        onBack={() => go("s15")} onCG={() => setShowCG(true)} />}

      {screen === "checkout" && selectedEq && quote && (
        <CheckoutPayment brand={brand} t={t} quote={quote} selectedEq={selectedEq} customerInfo={customerInfo}
          onSelectMethod={method => go(`pay_${method}`)}
          onBack={() => go("s16")} onCG={() => setShowCG(true)} />
      )}

      {screen === "pay_card" && selectedEq && (
        <CheckoutCard brand={brand} t={t}
          deposit={Math.round(((selectedEq.installation_price || 0) + (quote.adderTotal || 0)) * 0.5)}
          customerInfo={customerInfo}
          onSuccess={info => { setPaymentInfo(info); go("schedule"); }}
          onBack={() => go("checkout")} onCG={() => setShowCG(true)} />
      )}

      {screen === "pay_ach" && selectedEq && (
        <CheckoutACH brand={brand} t={t}
          deposit={Math.round(((selectedEq.installation_price || 0) + (quote.adderTotal || 0)) * 0.5)}
          onSuccess={info => { setPaymentInfo(info); go("schedule"); }}
          onBack={() => go("checkout")} onCG={() => setShowCG(true)} />
      )}

      {screen === "pay_ftl" && selectedEq && (
        <CheckoutFTL brand={brand} t={t}
          total={(selectedEq.installation_price || 0) + (quote.adderTotal || 0)}
          customerInfo={customerInfo}
          onSuccess={info => { setPaymentInfo(info); go("schedule"); }}
          onBack={() => go("checkout")} onCG={() => setShowCG(true)} />
      )}

      {screen === "pay_microf" && selectedEq && (
        <CheckoutMicrof brand={brand} t={t}
          total={(selectedEq.installation_price || 0) + (quote.adderTotal || 0)}
          customerInfo={customerInfo}
          onSuccess={info => { setPaymentInfo(info); go("schedule"); }}
          onBack={() => go("checkout")} onCG={() => setShowCG(true)} />
      )}

      {screen === "pay_affirm" && selectedEq && (
        <CheckoutAffirm brand={brand} t={t}
          total={(selectedEq.installation_price || 0) + (quote.adderTotal || 0)}
          onSuccess={info => { setPaymentInfo(info); go("schedule"); }}
          onBack={() => go("checkout")} onCG={() => setShowCG(true)} />
      )}

      {screen === "schedule" && (
        <CheckoutCalendar brand={brand} t={t} paymentInfo={paymentInfo}
          onConfirm={date => {
            setInstallDate(date.available_date);
            const ref = `ACB-${new Date().getFullYear()}-${String(Math.floor(Math.random()*99999)).padStart(5,"0")}`;
            setBookingRef(ref);
            go("confirmation");
          }}
          onBack={() => go("checkout")} onCG={() => setShowCG(true)} />
      )}

      {screen === "confirmation" && (
        <CheckoutConfirmation brand={brand} t={t} bookingRef={bookingRef} installDate={installDate} customerInfo={customerInfo}
          onDone={() => {
            setScreen("s1"); setProperty(null); setAnswers({}); setQuote(null);
            setBrandFamily(null); setSelectedBrand(null); setSelectedEq(null);
            setCustomerInfo(null); setPaymentInfo(null); setBookingRef(null); setInstallDate(null);
          }} />
      )}
    </div>
  );
}
