package chato;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ChatThread {

	public final String title;
	public final List<String> messages;

	public ChatThread(String title) {
		this.title = title;
		this.messages = Collections.synchronizedList(new ArrayList<>());
	}

	public String title() {
		return title;
	}

}
