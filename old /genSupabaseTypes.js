const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * Generates Supabase TypeScript types and updates the supabase.ts file
 */
function generateSupabaseTypes() {
	try {
		console.log("Running Supabase types generation...");

		// Execute the Supabase command and capture the output
		const output = execSync("supabase gen types typescript --local", {
			encoding: "utf-8",
			stdio: ["pipe", "pipe", "pipe"],
		});

		// Path to the types file
		// const typesFilePath = path.resolve("/utils/types/supabase.ts");
		//
		const typesFilePath = path.resolve(process.cwd(), "types/supabase.ts");

		// Write the output to the types file
		fs.writeFileSync(typesFilePath, output);

		console.log("Successfully updated Supabase types in:", typesFilePath);
		return true;
	} catch (error) {
		console.error("Failed to generate Supabase types:", error.message);
		if (error.stderr) {
			console.error("Error details:", error.stderr);
		}
		return false;
	}
}

// Execute the function
module.exports = generateSupabaseTypes;

// If running directly
if (require.main === module) {
	generateSupabaseTypes();
}
