package chato;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response.Status;

@Path("/threads")
@Produces(MediaType.APPLICATION_JSON)
public class ThreadsResource {

	@GET
	public Collection<ChatThread> list() {
		return ChatoState.threads.values();
	}

	@POST
	public ChatThread create(CreateThreadRequest request) {
		String threadID = UUID.randomUUID().toString();
		ChatThread thread = new ChatThread(threadID, request.threadName);
		ChatoState.threads.put(thread.id, thread);
		return thread;
	}

	@GET
	@Path("/{threadID}")
	public ChatThread messages(@PathParam("threadID") String threadID) {
		ChatThread thread = ChatoState.threads.get(threadID);
		if (thread == null) {
			throw new WebApplicationException(Status.NOT_FOUND);
		}
		return thread;
	}

	@PATCH
	@Path("/{threadID}")
	public ChatThread messages(@PathParam("threadID") String threadId, PostMessageRequest request) {
		ChatThread thread = ChatoState.threads.get(threadId);
		if (thread == null) {
			throw new WebApplicationException(Status.NOT_FOUND);
		}
		thread.messages.add(request.username + ": " + request.message);
		return thread;
	}

}
