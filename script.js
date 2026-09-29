/* =========================================================
   ELISHAMA PRESTIGE - Script principal
   1. Menu responsive (burger)
   2. Animations au défilement
   3. Validation du formulaire de réservation (index.html)
   4. Validation du formulaire de contact (contact.html)
   5. Année automatique dans le pied de page
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------------------------------------------------------
     1. MENU RESPONSIVE (BURGER)
     --------------------------------------------------------- */
  const boutonMenu = document.getElementById("boutonMenu");
  const navigation = document.getElementById("navigation");

  if (boutonMenu && navigation) {
    boutonMenu.addEventListener("click", function () {
      const estOuvert = navigation.classList.toggle("ouvert");
      boutonMenu.classList.toggle("ouvert", estOuvert);
      boutonMenu.setAttribute("aria-expanded", estOuvert ? "true" : "false");
      boutonMenu.setAttribute(
        "aria-label",
        estOuvert ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"
      );
    });

    // Fermer le menu après un clic sur un lien (mobile)
    navigation.querySelectorAll("a").forEach(function (lien) {
      lien.addEventListener("click", function () {
        if (navigation.classList.contains("ouvert")) {
          navigation.classList.remove("ouvert");
          boutonMenu.classList.remove("ouvert");
          boutonMenu.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  /* ---------------------------------------------------------
     2. ANIMATIONS AU DÉFILEMENT (.reveler)
     --------------------------------------------------------- */
  const elementsAReveler = document.querySelectorAll(".reveler");

  if ("IntersectionObserver" in window) {
    const observateur = new IntersectionObserver(
      function (entrees) {
        entrees.forEach(function (entree) {
          if (entree.isIntersecting) {
            entree.target.classList.add("visible");
            observateur.unobserve(entree.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    elementsAReveler.forEach(function (el) { observateur.observe(el); });
  } else {
    // Repli pour les navigateurs anciens
    elementsAReveler.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------------------------------------------------------
     3. ANNÉE AUTOMATIQUE
     --------------------------------------------------------- */
  const annee = document.getElementById("annee");
  if (annee) {
    annee.textContent = new Date().getFullYear();
  }

  /* =========================================================
     OUTILS DE VALIDATION
     ========================================================= */
  const REGEX_TELEPHONE = /^[0-9+\s().-]{8,20}$/;
  const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const REGEX_NOM = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,60}$/;

  function afficherErreur(champ, message) {
    if (!champ) return;
    champ.classList.add("erreur");
    const groupe = champ.closest(".groupe-champ");
    if (groupe) {
      const zoneErreur = groupe.querySelector(".message-erreur");
      if (zoneErreur) zoneErreur.textContent = message;
    }
  }

  function effacerErreur(champ) {
    if (!champ) return;
    champ.classList.remove("erreur");
    const groupe = champ.closest(".groupe-champ");
    if (groupe) {
      const zoneErreur = groupe.querySelector(".message-erreur");
      if (zoneErreur) zoneErreur.textContent = "";
    }
  }

  // Effacer l'erreur à la saisie
  document.querySelectorAll("input, select, textarea").forEach(function (champ) {
    champ.addEventListener("input", function () { effacerErreur(champ); });
    champ.addEventListener("change", function () { effacerErreur(champ); });
  });

  /* =========================================================
     4. FORMULAIRE DE RÉSERVATION (index.html)
     ========================================================= */
  const formReservation = document.getElementById("formReservation");

  if (formReservation) {
    const champNom = document.getElementById("nom");
    const champTelephone = document.getElementById("telephone");
    const champDate = document.getElementById("date");
    const champHeure = document.getElementById("heure");
    const champPersonnes = document.getElementById("personnes");
    const confirmationReservation = document.getElementById("confirmationReservation");

    // Définir la date minimale à aujourd'hui
    if (champDate) {
      const aujourdHui = new Date().toISOString().split("T")[0];
      champDate.setAttribute("min", aujourdHui);
    }

    formReservation.addEventListener("submit", function (evenement) {
      evenement.preventDefault();

      let valide = true;

      // --- Nom ---
      const valeurNom = champNom.value.trim();
      if (valeurNom === "") {
        afficherErreur(champNom, "Veuillez saisir votre nom complet.");
        valide = false;
      } else if (!REGEX_NOM.test(valeurNom)) {
        afficherErreur(champNom, "Le nom ne doit contenir que des lettres, espaces, tirets ou apostrophes.");
        valide = false;
      } else if (valeurNom.length < 2) {
        afficherErreur(champNom, "Le nom doit contenir au moins 2 caractères.");
        valide = false;
      }

      // --- Téléphone ---
      const valeurTel = champTelephone.value.trim();
      if (valeurTel === "") {
        afficherErreur(champTelephone, "Veuillez saisir votre numéro de téléphone.");
        valide = false;
      } else if (!REGEX_TELEPHONE.test(valeurTel)) {
        afficherErreur(champTelephone, "Numéro invalide. Exemple : 226 55 31 52 01");
        valide = false;
      } else {
        const chiffres = valeurTel.replace(/\D/g, "");
        if (chiffres.length < 8) {
          afficherErreur(champTelephone, "Le numéro doit contenir au moins 8 chiffres.");
          valide = false;
        }
      }

      // --- Date ---
      if (champDate.value === "") {
        afficherErreur(champDate, "Veuillez choisir une date de réservation.");
        valide = false;
      } else {
        const dateChoisie = new Date(champDate.value + "T00:00:00");
        const aujourdHui = new Date();
        aujourdHui.setHours(0, 0, 0, 0);
        if (dateChoisie < aujourdHui) {
          afficherErreur(champDate, "La date ne peut pas être dans le passé.");
          valide = false;
        }
      }

      // --- Heure ---
      if (champHeure.value === "") {
        afficherErreur(champHeure, "Veuillez choisir une heure d'arrivée.");
        valide = false;
      } else {
        const [h, m] = champHeure.value.split(":").map(Number);
        const minutes = h * 60 + m;
        if (minutes < 8 * 60 || minutes > 22 * 60) {
          afficherErreur(champHeure, "L'heure doit être comprise entre 08h00 et 22h00.");
          valide = false;
        }
      }

      // --- Personnes ---
      const nbPersonnes = parseInt(champPersonnes.value, 10);
      if (isNaN(nbPersonnes) || nbPersonnes < 1 || nbPersonnes > 12) {
        afficherErreur(champPersonnes, "Le nombre de personnes doit être compris entre 1 et 12.");
        valide = false;
      }

      // --- Résultat ---
      if (!valide) {
        const premierChampErreur = formReservation.querySelector(".erreur");
        if (premierChampErreur) {
          premierChampErreur.focus();
          premierChampErreur.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        confirmationReservation.classList.remove("visible");
        return;
      }

      // --- Succès ---
      const espace = document.getElementById("espace").value;
      const dateFormatee = new Date(champDate.value + "T00:00:00").toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      });

      confirmationReservation.innerHTML =
        "<strong>Réservation confirmée !</strong><br>" +
        "Merci " + valeurNom + ", votre table pour " + nbPersonnes +
        " personne(s) est réservée le " + dateFormatee +
        " à " + champHeure.value + " (" + espace + ").<br>" +
        "Nous vous rappelons au <strong>" + valeurTel + "</strong> pour confirmer.";

      confirmationReservation.classList.add("visible");
      confirmationReservation.scrollIntoView({ behavior: "smooth", block: "center" });

      // Réinitialiser le formulaire
      formReservation.reset();
      document.querySelectorAll(".message-erreur").forEach(function (p) { p.textContent = ""; });

      // Masquer la confirmation après 12 secondes
      setTimeout(function () {
        confirmationReservation.classList.remove("visible");
      }, 12000);
    });
  }

  /* =========================================================
     5. FORMULAIRE DE CONTACT (contact.html)
     ========================================================= */
  const formContact = document.getElementById("formContact");

  if (formContact) {
    const champNomC = document.getElementById("nomContact");
    const champEmailC = document.getElementById("emailContact");
    const champTelC = document.getElementById("telContact");
    const champSujetC = document.getElementById("sujetContact");
    const champMessageC = document.getElementById("messageContact");
    const confirmationContact = document.getElementById("confirmationContact");

    formContact.addEventListener("submit", function (evenement) {
      evenement.preventDefault();

      let valide = true;

      // --- Nom ---
      const valeurNom = champNomC.value.trim();
      if (valeurNom === "") {
        afficherErreur(champNomC, "Veuillez saisir votre nom complet.");
        valide = false;
      } else if (!REGEX_NOM.test(valeurNom)) {
        afficherErreur(champNomC, "Le nom ne doit contenir que des lettres, espaces, tirets ou apostrophes.");
        valide = false;
      }

      // --- Email ---
      const valeurEmail = champEmailC.value.trim();
      if (valeurEmail === "") {
        afficherErreur(champEmailC, "Veuillez saisir votre adresse e-mail.");
        valide = false;
      } else if (!REGEX_EMAIL.test(valeurEmail)) {
        afficherErreur(champEmailC, "Adresse e-mail invalide. Exemple : awa@email.com");
        valide = false;
      }

      // --- Téléphone ---
      const valeurTel = champTelC.value.trim();
      if (valeurTel === "") {
        afficherErreur(champTelC, "Veuillez saisir votre numéro de téléphone.");
        valide = false;
      } else if (!REGEX_TELEPHONE.test(valeurTel)) {
        afficherErreur(champTelC, "Numéro invalide. Exemple : 226 55 31 52 01");
        valide = false;
      } else {
        const chiffres = valeurTel.replace(/\D/g, "");
        if (chiffres.length < 8) {
          afficherErreur(champTelC, "Le numéro doit contenir au moins 8 chiffres.");
          valide = false;
        }
      }

      // --- Sujet ---
      if (champSujetC.value === "") {
        afficherErreur(champSujetC, "Veuillez choisir un sujet.");
        valide = false;
      }

      // --- Message ---
      const valeurMessage = champMessageC.value.trim();
      if (valeurMessage === "") {
        afficherErreur(champMessageC, "Veuillez écrire votre message.");
        valide = false;
      } else if (valeurMessage.length < 10) {
        afficherErreur(champMessageC, "Le message doit contenir au moins 10 caractères.");
        valide = false;
      }

      // --- Résultat ---
      if (!valide) {
        const premierChampErreur = formContact.querySelector(".erreur");
        if (premierChampErreur) {
          premierChampErreur.focus();
          premierChampErreur.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        confirmationContact.classList.remove("visible");
        return;
      }

      // --- Succès ---
      confirmationContact.innerHTML =
        "<strong>Message envoyé !</strong><br>" +
        "Merci " + valeurNom + ", nous avons bien reçu votre demande " +
        "(sujet : « " + champSujetC.value + " »).<br>" +
        "Nous vous répondrons à <strong>" + valeurEmail + "</strong> sous 24 heures.";

      confirmationContact.classList.add("visible");
      confirmationContact.scrollIntoView({ behavior: "smooth", block: "center" });

      formContact.reset();
      document.querySelectorAll(".message-erreur").forEach(function (p) { p.textContent = ""; });

      setTimeout(function () {
        confirmationContact.classList.remove("visible");
      }, 12000);
    });
  }

});