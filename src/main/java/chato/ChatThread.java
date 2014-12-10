package chato;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ChatThread {

	public String id;
	public String threadName;
	public List<String> messages;

	public ChatThread(String id, String threadName) {
		this.id = id;
		this.threadName = threadName;
		this.messages = Collections.synchronizedList(new ArrayList<>());
	}

	public String threadName() {
		return threadName;
	}

}
