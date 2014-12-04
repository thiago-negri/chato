package chato;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ChatoState {

	public static Map<String, ChatThread> threads = new ConcurrentHashMap<>();

}
