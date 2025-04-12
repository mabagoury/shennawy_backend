import { readdir, stat } from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";

/**
 * Recursively loads all .ts modules from the given directory.
 * @param packagePath Absolute path to the root directory.
 * @returns A nested object of loaded modules.
 */
export default async function loadPackage(packagePath: string): Promise<Record<string, any>> {
    const modules: Record<string, any> = {};

    const entries = await readdir(packagePath);

    for (const entry of entries) {
        const entryPath = path.join(packagePath, entry);
        const fileStat = await stat(entryPath);

        if (fileStat.isDirectory()) {
            // Recurse into subdirectory
            modules[entry] = await loadPackage(entryPath);
        } else if (entry.endsWith(".js")) {
            // Dynamically import the module
            const moduleName = path.basename(entry, ".js");
            const modulePath = pathToFileURL(entryPath).href;
            modules[moduleName] = await import(modulePath);
        }
    }

    return modules;
}
