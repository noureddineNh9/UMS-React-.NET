using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class Mail
    {
        public int ID { get; set; }
        public string SenderID { get; set; }
        public string SenderName { get; set; }
        public string Object { get; set; }
        public string Message { get; set; }
        public bool Vu { get; set; }
        public DateTime date { get; set; }

        public string RicipientId { get; set; }
        public string RicipientName { get; set; }

    }
 
}
