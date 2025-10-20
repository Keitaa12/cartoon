export class SlugHelper {
  /**
   * Génère un slug à partir d'un nom
   * @param name - Le nom à convertir en slug
   * @returns Le slug généré
   */
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
      .replace(/[^a-z0-9\s-]/g, "") // Supprimer les caractères spéciaux
      .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
      .replace(/-+/g, "-") // Remplacer les tirets multiples par un seul
      .trim();
  }

  /**
   * Génère un slug unique en ajoutant un numéro si nécessaire
   * @param baseSlug - Le slug de base
   * @param checkExists - Fonction pour vérifier si le slug existe déjà
   * @returns Le slug unique
   */
  static async generateUniqueSlug(
    baseSlug: string,
    checkExists: (slug: string) => Promise<boolean>,
  ): Promise<string> {
    let finalSlug = baseSlug;
    let counter = 1;

    while (await checkExists(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    return finalSlug;
  }
}
