using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Olx.BLL.Entities.AdminMessages;

namespace Olx.DAL.Data.EntityConfigs
{
    public class AdminMessageConfig : IEntityTypeConfiguration<AdminMessage>
    {
        public void Configure(EntityTypeBuilder<AdminMessage> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.Message)
                .WithMany(x => x.AdminMessages)
                .HasForeignKey(x => x.MessageId);
        }
    }
}
