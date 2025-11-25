using Microsoft.AspNetCore.Mvc;
using AgenteIA.Models;
using AgenteIA.Helpers;
using OpenAI_API;

namespace AgenteIA.Controllers
{
    [Route("Agente")]
    public class AgenteController : Controller
    {
        private readonly OpenAIAPI _api;

        public AgenteController(OpenAIAPI api)
        {
            _api = api;
        }

        //GET: /Agente/Chat
        [HttpGet("Chat")]
        public IActionResult Chat()
        {
            var messages = HttpContext.Session.GetObject<List<ChatMessage>>("ChatHistory") ?? new List<ChatMessage>();
            return View("~/Views/Chat/chat.cshtml", messages);
        }

        // POST: /Agente/Send
        [HttpPost("Send")]
        public async Task<IActionResult> Send([FromBody] ChatMessage input)
        {
            if (input == null || string.IsNullOrWhiteSpace(input.UserInput))
                return BadRequest();

            var history = HttpContext.Session.GetObject<List<ChatMessage>>("ChatHistory") ?? new List<ChatMessage>();

            var conversation = _api.Chat.CreateConversation();

            foreach (var msg in history)
            {
                if (!string.IsNullOrWhiteSpace(msg.UserInput))
                    conversation.AppendUserInput(msg.UserInput);

                if (!string.IsNullOrWhiteSpace(msg.Response))
                    conversation.AppendSystemMessage(msg.Response);
            }

            conversation.AppendUserInput(input.UserInput);

            string response;
            try
            {
                response = await conversation.GetResponseFromChatbotAsync();
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error de llamado de API");
            }

            var newMsg = new ChatMessage
            {
                UserInput = input.UserInput,
                Response = response
            };
            history.Add(newMsg);
            HttpContext.Session.SetObject("ChatHistory", history);

            return PartialView("~/Views/Chat/_ChatEntry.cshtml", newMsg);
        }
    }
}
