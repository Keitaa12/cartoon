# API Chain - Documentation

## Endpoints disponibles

### 1. Créer une chaîne
- **POST** `/chain`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "name": "McDonald's",
  "description": "Restaurant de fast-food américain spécialisé dans les hamburgers",
  "imageUrl": "https://example.com/images/mcdonalds-logo.png"
}
```

### 2. Obtenir toutes les chaînes
- **GET** `/chain`
- **Headers**: `Authorization: Bearer <token>`
- **Guards**: JWT + Roles

### 3. Obtenir toutes les chaînes avec pagination
- **GET** `/chain/paginated?page=1&limit=10`
- **Headers**: `Authorization: Bearer <token>`
- **Guards**: JWT + Roles
- **Query Parameters**:
  - `page` (optionnel): Numéro de page (commence à 1)
  - `limit` (optionnel): Nombre d'éléments par page (max 100)

### 4. Obtenir une chaîne par ID
- **GET** `/chain/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Guards**: JWT

### 5. Modifier une chaîne
- **PUT** `/chain/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Guards**: JWT
- **Body**:
```json
{
  "name": "McDonald's Updated",
  "description": "Description mise à jour",
  "imageUrl": "https://example.com/images/new-logo.png"
}
```

### 6. Supprimer une chaîne
- **DELETE** `/chain/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Guards**: JWT

## Validation des données

### CreateChainDto / UpdateChainDto
- `name`: 
  - Obligatoire
  - Chaîne de caractères
  - 2-100 caractères
- `description`: 
  - Obligatoire
  - Chaîne de caractères
  - 10-500 caractères
- `imageUrl`: 
  - Obligatoire
  - URL valide

## Réponses

### Succès
- **Création**: `{ chain: Chain, message: string }`
- **Mise à jour**: `{ status: true, message: string }`
- **Suppression**: `{ status: true, message: string }`
- **Lecture**: `Chain` ou `Chain[]`

### Erreurs
- **404**: Chaîne non trouvée
- **400**: Données de validation invalides
- **401**: Non authentifié
- **403**: Accès refusé (rôles insuffisants)
