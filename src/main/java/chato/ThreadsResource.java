package chato;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

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
	public Collection<String> list() {
		return ChatoState.threads.values().stream().map(ChatThread::title).collect(Collectors.toList());
	}

	@POST
	public void create(CreateThreadRequest request) {
		if (ChatoState.threads.get(request.threadName) != null) {
			throw new WebApplicationException(Status.CONFLICT);
		}
		ChatThread thread = new ChatThread(request.threadName);
		ChatoState.threads.put(request.threadName, thread);
	}

	@GET
	@Path("/{threadId}")
	public List<String> messages(@PathParam("threadId") String threadId) {
		ChatThread thread = ChatoState.threads.get(threadId);
		if (thread == null) {
			throw new WebApplicationException(Status.NOT_FOUND);
		}
		return thread.messages;
	}

	@POST
	@Path("/{threadId}")
	public void messages(@PathParam("threadId") String threadId, PostMessageRequest request) {
		ChatThread thread = ChatoState.threads.get(threadId);
		if (thread == null) {
			throw new WebApplicationException(Status.NOT_FOUND);
		}
		thread.messages.add(request.username + ": " + request.message);
	}

}
