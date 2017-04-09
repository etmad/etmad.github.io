import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.text.*;
import java.net.*;
import java.io.*;


//import GSInteractor;

public class SubsStorageBot
// implements Runnable
{

	public static void main(String[] args) {

		while (true) {

			BufferedWriter writer;
			String channel = "#etozhemad";
			String server = "irc.chat.twitch.tv";
			String nick = "justinfan515935";
			String pass = "blah";

			Socket socket;
			try {
				socket = new Socket(server, 6667);
				writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream(), "UTF-8"));
				BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream(), "UTF-8"));

				writer.write("PASS " + pass + "\r\n");
				writer.write("USER " + nick + "\r\n");
				writer.write("NICK " + nick + "\r\n");
				writer.write("JOIN " + channel + "\r\n");
				writer.write("CAP REQ :twitch.tv/membership\r\n");
				writer.write("CAP REQ :twitch.tv/tags\r\n");

				writer.flush();

				String line = null;
				while ((line = reader.readLine()) != null) {
					System.err.println(line);
					if (line.toUpperCase().startsWith("PING ")) {
						writer.write("PONG " + line.substring(5) + "\r\n");
						writer.flush();
					} else {
					}

						if (line.contains("PRIVMSG")) {
	
						if (line.contains("twitchnotify@twitchnotify")){
						line = line.replaceAll("^:", "");
						line = line.trim();
						String user = "";
						for (int i = 0; i < line.length(); i++) 
							if (line.substring(i, i + 1).equals("!")) {
								user = line.substring(0, i);
								break;
							}
						
						for (int i = 0; i < line.length(); i++) 
							if (line.substring(i, i + 1).equalsIgnoreCase(":")) {
								line = line.replace(line.substring(0, i + 1), "");
								break;
							}
						
						//gsi.add(new SimpleDateFormat("dd-MM-yyyy").format(new Date()), user, line);
						
						boolean isPrime = line.contains("Twitch Prime");
						String src = isPrime?"https://static-cdn.jtvnw.net/badges/v1/a1dd5073-19c3-4911-8cb4-c464a7bc1510/1":"https://static-cdn.jtvnw.net/badges/v1/c5439b12-e908-4f87-8c92-0bd63836b636/1";
						src = "<tr><td><img src=\""+src+"\"></td><td>"+user+"</td><td>"+new SimpleDateFormat("dd-MM-yyyy").format(new Date())+"</td><td>"+line+"</td></tr>";
						if(!isPrime) 
						{
							PrintWriter out = new PrintWriter(new FileOutputStream(new File("non-primes.htm"), true));
							out.println(src);
							out.close();
						}
						
						PrintWriter out = new PrintWriter(new FileOutputStream(new File("all.htm"), true));
						out.println(src);
						out.close();
							
						}
					}
				}

			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	static final String decode(final String in) {
		String working = in;
		int index;
		index = working.indexOf("\\u");
		while (index > -1) {
			int length = working.length();
			if (index > (length - 6))
				break;
			int numStart = index + 2;
			int numFinish = numStart + 4;
			String substring = working.substring(numStart, numFinish);
			int number = Integer.parseInt(substring, 16);
			String stringStart = working.substring(0, index);
			String stringEnd = working.substring(numFinish);
			working = stringStart + ((char) number) + stringEnd;
			index = working.indexOf("\\u");
		}
		return working;
	}

	public static String getPageByAddress(String url) throws Exception {
		URL website = new URL(url);
		// System.err.println(url);
		URLConnection connection = website.openConnection();
		connection.setRequestProperty("User-Agent",
				"Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36");

		connection.setRequestProperty("Connection", "keep-alive");
		connection.setRequestProperty("Cache-Control", "max-age=0");

		BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));

		StringBuilder response = new StringBuilder();
		String inputLine;

		while ((inputLine = in.readLine()) != null)
			response.append(inputLine);

		in.close();

		return response.toString();
	}

}
