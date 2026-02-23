

--added

UTILISATEUR

UTILISATEUR (
    id_utilisateur PK,
    nom, not null
    prenom, not null
    email UNIQUE,
    mot_de_passe, not null
    telephone,
    statut,   not null    contraint 1 or 2    -- actif / bloqué 
    datetime_creation --now
    id_role FK -- fk 
)

ROLE

ROLE (
    id_role PK,
    libelle           -- ADMIN, BOUTIQUE, ACHETEUR
)

CENTRE_COMMERCIAL

CENTRE_COMMERCIAL (
    id_centre PK,
    nom,unique not null
    adresse, 
    ville,
    description,
    last_updated datetime --- now default ,
)

Horaires_Centre (
    id_horaires
    id_centre FK not null
    id_jour --CONSTRAINT (1 -- 7) not null
    heure_ouverture type time  not null
    heure_fermeture type time not null
)

-- regles interne pendant jour ferrier 

BOUTIQUE

BOUTIQUE (
    id_boutique PK,
    nom, not null
    description,
    id_categorie_boutique FK, not null
    etage, not null
    emplacement, not null--number (12,13 ...) not null
    telephone,
    email,  not null
    logo,
    statut FK,       not null     -- actif / suspendu (change) fk 
    datetime_added -- --datetime now default
)

Admin_Boutique(
    id_admin_boutique PK 
    id_utilisateur  not null
    id_boutique  not null
    last_updated --datetime now default
)

Categorie_Boutique (
    id_categorie_boutique pk 
    nom 
    description
)

Emplacement ---

Loyer_Emplacement(
    id_loyer_emplacement 
    emplacement  not null--number CHECKED
    montant  not null -- chiffre 
    date_debut   not null
)

Charges_Emplacement ( --charges additionel facturation
    id_charge_emplacement PK 
    id_admin_centre_utilisateur FK (Admin_centre)  not null
    id_boutique FK  not null
    id_type_charges FK  not null --jirama
    montant  not null
    commentaire 
    datetime_payment
    date_limite
)

Types_Charges (
    id_type_charge
    nom  not null
    description
)

Demande_centre (
    id_demande_centre
    description 
    id_admin_boutique_utilisateur FK (Admin_Boutique) not null
    datetime_demande  not null
    read_at --datetime 
    read_by
)

Annonce(
    id_annonce
    target  not null --public (tlmd), boutique et proprio
    id_utilisateur  FK not null
    datetime_annonce  not null
    photo
)

CATEGORIE_PRODUIT

CATEGORIE_PRODUIT ( --clothing
    id_categorie PK,
    libelle  not null
)

Sous_categorie( --shorts
    id_sous_categorie
    nom 
    id_categorie fk
)

PRODUIT

PRODUIT (
    id_produit PK,
    nom, not null
    id_sous_categorie FK   not null
    last_updated datetime 
)

Produit_boutique(
    id_produit_boutique
    id_produit
    id_boutique FK, not null
    stock, must be positive number -- (change)dernormalisation from stock_mouvement_produit 
    image, not null
    statut,   contraint 1 or 2        -- disponible / indisponible 
    description, 
    last_updated
)

Prix_Produit (
    id_prix_produit PK
    id_produit_boutique FK  not null
    montant  not null
    datetime_changement   not null
)

stock_mouvement_produit(
    id_mouvement 
    id_produit_boutique  not null
    mouvement  1 or 2  not null-- INT in or out 
    nb_produit   not null
    datetime_mouvement  not null
)

Panier ( --asina limite de time. hoe zao minute dia miala ho azy. 
    id_panier 
    id_utilisateur_client  not null
    datetime_creation  not null
    last_updated  not null -- 
    statut  contraint between 1 or 2 or 3 -- en cours, payed, livrer. 
    prix_total --set at payment time because price might change + delivery fee
    mode_paiement between 1 or 2 -- cash or card
    type_livraison between 1 or 2 -- sur place, deplacement
)

-- additional tables
    --details payment 
    --details delivery if delivered

DETAIL_Pannier (
    id_detail PK,
    id_produit_boutique FK not null
    quantite, not null
    id_pannier FK not null
    datetime_added not null
    shipping_fee -- 0 if sur place and set price eo if not (jerevana) look at status in panier
    price_per_item not null--denormalisation -- needs to be checked everytime (promotion and changes)
)

PROMOTION (
    id_promotion
    nom, not null
    description,
    pourcentage ,  between 1 and a 100    not null
    datetime_debut, not null
    datetime_fin,not null
)

PRODUIT_PROMOTION

PRODUIT_PROMOTION (
    id_produit_promotion
    id_produit_boutique PK FK, not null
    id_promotion PK FK not null
    datetime_added not null
)


CARTE_FIDELITE

CARTE_FIDELITE (
    id_fidelite PK,
    id_boutique fk
    points, not null--misy regles hoe apres zao points zao% remise pour prochain achat 
    -- 1 point ex:5,000 ar 
    id_acheteur FK not null--client
    datetime_added not null--datetime 
)

AVIS_Boutique ( --check que client
    id_avis_boutique PK,
    note, between 1 and 10-- sur 10 PUT CONSTRAINT
    commentaire,
    datetime_avis, not null
    id_acheteur FK, not null
    id_boutique FK not null
)

AVIS_Produit ( --check que client
    id_avis_boutique PK,
    note, between 1 and 10-- sur 10 PUT CONSTRAINT
    commentaire,
    datetime_avis, not null
    id_acheteur FK, not null
    id_produit_boutique FK not null
)

Historique_Favoris(
    id_utilisateur_client
    id_produit_boutique not null
    datetime_modif not null
    status  between 1 and 2-- isFav / cancel
)





