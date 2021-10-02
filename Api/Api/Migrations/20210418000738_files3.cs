using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class files3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileName",
                table: "FilesDetails");

            migrationBuilder.RenameColumn(
                name: "FileContent",
                table: "FilesDetails",
                newName: "DataFiles");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "FilesDetails",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileType",
                table: "FilesDetails",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "FilesDetails",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "FilesDetails");

            migrationBuilder.DropColumn(
                name: "FileType",
                table: "FilesDetails");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "FilesDetails");

            migrationBuilder.RenameColumn(
                name: "DataFiles",
                table: "FilesDetails",
                newName: "FileContent");

            migrationBuilder.AddColumn<string>(
                name: "FileName",
                table: "FilesDetails",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
