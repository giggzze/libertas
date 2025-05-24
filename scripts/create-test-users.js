const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "http://127.0.0.1:54321";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

const supabase = createClient(supabaseUrl, supabaseKey);

const testUsers = [
	{
		email: "john.doe@example.com",
		password: "password123",
		fullName: "John Doe",
	},
	{
		email: "jane.smith@example.com",
		password: "password123",
		fullName: "Jane Smith",
	},
	{
		email: "bob.johnson@example.com",
		password: "password123",
		fullName: "Bob Johnson",
	},
];

async function createTestUsers() {
	console.log("Creating test users...");

	for (const user of testUsers) {
		try {
			const { data, error } = await supabase.auth.signUp({
				email: user.email,
				password: user.password,
				options: {
					data: {
						full_name: user.fullName,
					},
				},
			});

			if (error) {
				console.error(
					`Error creating user ${user.email}:`,
					error.message
				);
			} else {
				console.log(
					`✅ Created user: ${user.email} (ID: ${data.user.id})`
				);
			}
		} catch (err) {
			console.error(`Error creating user ${user.email}:`, err);
		}
	}
}

createTestUsers();
