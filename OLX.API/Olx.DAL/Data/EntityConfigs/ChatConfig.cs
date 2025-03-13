using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Olx.BLL.Entities.ChatEntities;

namespace Olx.DAL.Data.EntityConfigs
{
    public class ChatConfig : IEntityTypeConfiguration<Chat>
    {
        public void Configure(EntityTypeBuilder<Chat> builder)
        {
            builder.HasMany(x => x.Messages)
                .WithOne(x => x.Chat)
                .HasForeignKey(x=>x.ChatId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.Advert)
               .WithMany(x => x.Chats)
               .HasForeignKey(x => x.AdvertId)
               .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
