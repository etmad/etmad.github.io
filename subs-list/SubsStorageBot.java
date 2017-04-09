import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.text.*;
import java.net.*;

//import GSInteractor;

public class SubsStorageBot
// implements Runnable
{

	public static String getYoutubeVideoId(String youtubeUrl) {
		String video_id = "";
		if (youtubeUrl != null && youtubeUrl.trim().length() > 0 && youtubeUrl.startsWith("http")) {

			String expression = "^.*((youtu.be" + "\\/)"
					+ "|(v\\/)|(\\/u\\/w\\/)|(embed\\/)|(watch\\?))\\??v?=?([^#\\&\\?]*).*"; // var
																								// regExp
																								// =
																								// /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
			CharSequence input = youtubeUrl;
			Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
			Matcher matcher = pattern.matcher(input);
			if (matcher.matches()) {
				String groupIndex1 = matcher.group(7);
				if (groupIndex1 != null && groupIndex1.length() == 11)
					video_id = groupIndex1;
			}
		}
		return video_id;
	}

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
						user = "";
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
						
						boolean isPrime = false;
						if(line.contains("Twitch Prime")) isPrime = true;
							
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
