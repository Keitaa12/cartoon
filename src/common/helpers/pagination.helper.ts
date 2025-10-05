export interface PaginationOptions {
    page: number;
    limit: number;
}

export interface PaginationResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export class PaginationHelper {
    /**
     * Calcule les options de pagination pour TypeORM
     * @param page - Numéro de page (commence à 1)
     * @param limit - Nombre d'éléments par page
     * @returns Options de pagination pour TypeORM
     */
    static getPaginationOptions(page: number, limit: number) {
        const normalizedPage = Math.max(1, page);
        const normalizedLimit = Math.max(1, Math.min(100, limit)); // Limite max à 100
        
        return {
            skip: (normalizedPage - 1) * normalizedLimit,
            take: normalizedLimit,
        };
    }

    /**
     * Calcule les métadonnées de pagination
     * @param page - Numéro de page
     * @param limit - Nombre d'éléments par page
     * @param total - Nombre total d'éléments
     * @returns Métadonnées de pagination
     */
    static getPaginationMeta(page: number, limit: number, total: number) {
        const normalizedPage = Math.max(1, page);
        const normalizedLimit = Math.max(1, Math.min(100, limit));
        const totalPages = Math.ceil(total / normalizedLimit);

        return {
            page: normalizedPage,
            limit: normalizedLimit,
            total,
            totalPages,
            hasNext: normalizedPage < totalPages,
            hasPrev: normalizedPage > 1,
        };
    }

    /**
     * Crée un résultat de pagination complet
     * @param data - Les données paginées
     * @param page - Numéro de page
     * @param limit - Nombre d'éléments par page
     * @param total - Nombre total d'éléments
     * @returns Résultat de pagination complet
     */
    static createPaginationResult<T>(
        data: T[],
        page: number,
        limit: number,
        total: number
    ): PaginationResult<T> {
        return {
            data,
            pagination: this.getPaginationMeta(page, limit, total),
        };
    }
}
